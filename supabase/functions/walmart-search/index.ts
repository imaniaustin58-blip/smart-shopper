import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("query") ?? "";

    if (!query.trim()) {
      return new Response(JSON.stringify({ error: "Missing query parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("SERPAPI_API_KEY");
    if (!apiKey) {
      console.error("SERPAPI_API_KEY is not configured in edge function secrets");
      return new Response(
        JSON.stringify({ error: "Live Walmart pricing is temporarily unavailable." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const params = new URLSearchParams({
      engine: "walmart",
      query: query,
      api_key: apiKey,
    });

    const serpapiResponse = await fetch(`https://serpapi.com/search?${params.toString()}`);

    if (!serpapiResponse.ok) {
      console.error(`SerpApi responded with status ${serpapiResponse.status}`);
      const errorText = await serpapiResponse.text();
      console.error(`SerpApi error body: ${errorText}`);
      return new Response(
        JSON.stringify({ error: "Live Walmart pricing is temporarily unavailable." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const json = await serpapiResponse.json();

    if (json.error) {
      console.error(`SerpApi error: ${json.error}`);
      return new Response(
        JSON.stringify({ error: "Live Walmart pricing is temporarily unavailable." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Live Walmart pricing is temporarily unavailable." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
