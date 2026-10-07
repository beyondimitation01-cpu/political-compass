Deno.serve((_req) => new Response("okrika", { status: 200, headers: { "Content-Type": "text/plain" } }));
