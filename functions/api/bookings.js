export async function onRequest(context) {
  const { env } = context;
  
  try {
    // Fetch all confirmed bookings from D1
    const { results } = await env.DB.prepare(
      "SELECT room_id, check_in, check_out FROM bookings WHERE status = 'confirmed'"
    ).all();

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("D1 Bookings Error:", error.message, error.stack);
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
