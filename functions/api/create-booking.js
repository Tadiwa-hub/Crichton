export async function onRequestPost(context) {
  const { env } = context;
  
  try {
    const data = await context.request.json();
    const { room_id, check_in, check_out } = data;

    // Insert the booking into D1 automatically
    await env.DB.prepare(
      "INSERT INTO bookings (room_id, check_in, check_out, status) VALUES (?, ?, ?, 'confirmed')"
    ).bind(room_id, check_in, check_out).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
