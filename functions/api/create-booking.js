export async function onRequestPost(context) {
  const { env } = context;
  
  try {
    const data = await context.request.json();
    const { room_id, check_in, check_out } = data;

    console.log('Creating booking with:', { room_id, check_in, check_out });

    // Insert the booking into D1 automatically
    const result = await env.DB.prepare(
      "INSERT INTO bookings (room_id, check_in, check_out, status) VALUES (?, ?, ?, 'confirmed')"
    ).bind(room_id, check_in, check_out).run();

    console.log('Booking created successfully:', result);

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Booking creation error:', error.message, error);
    return new Response(JSON.stringify({ error: error.message, details: error.toString() }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
