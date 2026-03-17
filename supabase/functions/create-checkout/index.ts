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

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");

    const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const { ebookId } = await req.json();
    if (!ebookId) throw new Error("ebookId required");

    // Get ebook
    const { data: ebook, error: ebookError } = await supabase
      .from("ebooks")
      .select("id, slug, title, price, stripe_price_id, is_published")
      .eq("id", ebookId)
      .single();

    if (ebookError || !ebook) throw new Error("Ebook not found");
    if (!ebook.is_published) throw new Error("Ebook not available");

    // Check already purchased
    const { data: existing } = await supabase
      .from("purchases")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("ebook_id", ebookId)
      .eq("status", "COMPLETED")
      .maybeSingle();

    if (existing) throw new Error("Already purchased");

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

    // Create or find Stripe price
    let priceId = ebook.stripe_price_id;
    if (!priceId) {
      // Create product and price in Stripe
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

      // Save back to ebook using service role
      const supabaseAdmin = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
      await supabaseAdmin.from("ebooks").update({
        stripe_product_id: product.id,
        stripe_price_id: price.id,
      }).eq("id", ebook.id);
    }

    // Determine base URL from origin header or fallback
    const origin = req.headers.get("origin") || "https://cyberhawk-ug.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: { ebookId: ebook.id, userId: user.id },
      success_url: `${origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/store/${ebook.slug}`,
    });

    // Create PENDING purchase via service role
    const supabaseAdmin = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    await supabaseAdmin.from("purchases").insert({
      user_id: user.id,
      ebook_id: ebook.id,
      status: "PENDING",
      amount_paid: ebook.price,
      currency: "usd",
      stripe_session_id: session.id,
    });

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
