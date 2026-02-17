import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, displayName } = await req.json();

    // Log the new signup for admin notification
    console.log(`🔔 New user signup: ${displayName} (${email}) — awaiting approval`);

    // In production, you could integrate an email service here
    // For now, admin can check the Admin panel at /admin

    return new Response(
      JSON.stringify({ success: true, message: "Admin notified" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
