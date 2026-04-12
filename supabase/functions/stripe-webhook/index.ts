import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

serve(async (req) => {
  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not configured");
    if (!STRIPE_WEBHOOK_SECRET) throw new Error("STRIPE_WEBHOOK_SECRET not configured");

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig) throw new Error("Missing stripe-signature header");

    const event: Stripe.Event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Idempotency check
    const { data: existing } = await supabaseAdmin
      .from("stripe_events")
      .select("processed")
      .eq("id", event.id)
      .maybeSingle();

    if (existing?.processed) return new Response("Already processed", { status: 200 });

    // Log event
    await supabaseAdmin.from("stripe_events").upsert({
      id: event.id,
      type: event.type,
      payload: event as any,
    });

    // Handle events
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await supabaseAdmin
        .from("purchases")
        .update({
          status: "COMPLETED",
          stripe_payment_id: session.payment_intent as string,
        })
        .eq("stripe_session_id", session.id);
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;
      await supabaseAdmin
        .from("purchases")
        .update({ status: "REFUNDED", refunded_at: new Date().toISOString() })
        .eq("stripe_payment_id", charge.payment_intent as string);
    }

    if (event.type === "charge.dispute.created") {
      const dispute = event.data.object as Stripe.Dispute;
      await supabaseAdmin
        .from("purchases")
        .update({ status: "DISPUTED" })
        .eq("stripe_payment_id", dispute.payment_intent as string);
    }

    // Mark processed
    await supabaseAdmin
      .from("stripe_events")
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq("id", event.id);

    return new Response("OK", { status: 200 });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response("Webhook processing failed", { status: 400 });
  }
});
