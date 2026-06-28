export async function onRequest(context) {
  const { env, request } = context;
  
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }

  try {
    if (request.method === "GET") {
      const { results } = await env.DB.prepare(
        "SELECT * FROM rooms"
      ).all();

      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (request.method === "PUT") {
      const body = await request.json();
      const { id, price, image, gallery } = body;

      if (!id) {
        return new Response(JSON.stringify({ error: "Room ID is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // We expect gallery as a JSON array or array, then stringify
      const galleryStr = Array.isArray(gallery) ? JSON.stringify(gallery) : (gallery || null);

      await env.DB.prepare(
        `UPDATE rooms 
         SET price = ?, image = ?, gallery = ?
         WHERE id = ?`
      ).bind(price || 0, image || null, galleryStr, id).run();

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("D1 Rooms Error:", error.message, error.stack);
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
