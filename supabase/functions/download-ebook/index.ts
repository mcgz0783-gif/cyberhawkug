import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_DOWNLOADS = 10;
const SIGNED_URL_EXPIRY = 900; // 15 minutes

const SAFE_ERRORS = new Set([
  "Not authenticated",
  "Unauthorized",
  "purchaseId required",
  "Purchase not found",
  "Purchase not completed",
  "Access revoked — purchase was refunded",
  "Download limit reached (10/10)",
  "Ebook file not available",
  "Account suspended",
]);

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_PUBLISHABLE_KEY = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");

    const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    // Check if user is banned
    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("is_banned, is_active")
      .eq("id", user.id)
      .single();
    if (profile?.is_banned || profile?.is_active === false) throw new Error("Account suspended");

    const { purchaseId } = await req.json();
    if (!purchaseId) throw new Error("purchaseId required");

    // Get purchase with ebook info
    const { data: purchase, error: purchaseError } = await supabase
      .from("purchases")
      .select("*, ebooks(file_key, title)")
      .eq("id", purchaseId)
      .eq("user_id", user.id)
      .single();

    if (purchaseError || !purchase) throw new Error("Purchase not found");
    if (purchase.status !== "COMPLETED") throw new Error("Purchase not completed");
    if (purchase.status === "REFUNDED") throw new Error("Access revoked — purchase was refunded");
    if (purchase.download_count >= MAX_DOWNLOADS) throw new Error("Download limit reached (10/10)");

    const ebook = purchase.ebooks as any;
    if (!ebook?.file_key) throw new Error("Ebook file not available");

    // Generate signed URL using service role
    const { data: signedUrl, error: signError } = await supabaseAdmin.storage
      .from("ebooks")
      .createSignedUrl(ebook.file_key, SIGNED_URL_EXPIRY, {
        download: `${ebook.title}.pdf`,
      });

    if (signError || !signedUrl) throw new Error("Could not generate download link");

    // Increment download count
    await supabaseAdmin.from("purchases").update({
      download_count: purchase.download_count + 1,
      last_download_at: new Date().toISOString(),
    }).eq("id", purchase.id);

    return new Response(JSON.stringify({ url: signedUrl.signedUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Download error:", error);
    const msg = SAFE_ERRORS.has(error.message) ? error.message : "An unexpected error occurred";
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
