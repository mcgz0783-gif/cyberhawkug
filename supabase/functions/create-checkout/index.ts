import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_PUBLISHABLE_KEY = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");

    const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const { ebookId, discountCode } = await req.json();
    if (!ebookId) throw new Error("ebookId required");

    const { data: ebook, error: ebookError } = await supabase
      .from("ebooks")
      .select("id, slug, title, price, stripe_price_id, is_published")
      .eq("id", ebookId)
      .single();

    if (ebookError || !ebook) throw new Error("Ebook not found");
    if (!ebook.is_published) throw new Error("Ebook not available");

    const { data: existing } = await supabase
      .from("purchases")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("ebook_id", ebookId)
      .eq("status", "COMPLETED")
      .maybeSingle();

    if (existing) throw new Error("Already purchased");

    const supabaseAdmin = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Validate discount code if provided
    let discountPercent = 0;
    let discountId: string | null = null;
    if (discountCode) {
      const { data: discount } = await supabaseAdmin
        .from("discount_codes")
        .select("*")
        .eq("code", discountCode.toUpperCase().trim())
        .eq("is_active", true)
        .maybeSingle();

      if (!discount) throw new Error("Invalid discount code");
      if (discount.expires_at && new Date(discount.expires_at) < new Date()) throw new Error("Discount code expired");
      if (discount.max_uses && discount.current_uses >= discount.max_uses) throw new Error("Discount code usage limit reached");

      discountPercent = discount.discount_percent;
      discountId = discount.id;
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

    let priceId = ebook.stripe_price_id;
    if (!priceId) {
      const product = await stripe.products.create({
        name: ebook.title,
        metadata: { ebook_id: ebook.id },
      });
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: ebook.price,
        currency: "usd",
      });
      priceId = price.id;

      await supabaseAdmin.from("ebooks").update({
        stripe_product_id: product.id,
        stripe_price_id: price.id,
      }).eq("id", ebook.id);
    }

    const origin = req.headers.get("origin") || "https://cyberhawk-ug.com";

    // Create Stripe coupon if discount applies
    let stripeCouponId: string | undefined;
    if (discountPercent > 0) {
      const coupon = await stripe.coupons.create({
        percent_off: discountPercent,
        duration: "once",
        metadata: { discount_code: discountCode },
      });
      stripeCouponId = coupon.id;
    }

    const sessionParams: any = {
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: { ebookId: ebook.id, userId: user.id, discountCode: discountCode || "" },
      success_url: `${origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/store/${ebook.slug}`,
    };

    if (stripeCouponId) {
      sessionParams.discounts = [{ coupon: stripeCouponId }];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    // Calculate actual amount paid
    const actualAmount = discountPercent > 0
      ? Math.round(ebook.price * (1 - discountPercent / 100))
      : ebook.price;

    await supabaseAdmin.from("purchases").insert({
      user_id: user.id,
      ebook_id: ebook.id,
      status: "PENDING",
      amount_paid: actualAmount,
      currency: "usd",
      stripe_session_id: session.id,
    });

    // Increment discount code usage
    if (discountId) {
      await supabaseAdmin.rpc("increment_discount_usage", { discount_id: discountId }).catch(() => {
        // Fallback: direct update
        supabaseAdmin.from("discount_codes")
          .update({ current_uses: discountPercent }) // Will be handled by trigger
          .eq("id", discountId);
      });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
