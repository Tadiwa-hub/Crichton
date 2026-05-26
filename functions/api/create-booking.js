export async function onRequestPost(context) {
  const { env } = context;
  
  try {
    const data = await context.request.json();
    const { room_id, check_in, check_out } = data;

    // Validate dates
    if (!room_id || !check_in || !check_out) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check for conflicting bookings
    const conflictingBookings = await env.DB.prepare(
      `SELECT * FROM bookings 
       WHERE status = 'confirmed' 
       AND (
         (room_id = ? AND check_in < ? AND check_out > ?)
         OR (room_id = 'Full House' AND ? NOT IN ('Self Catering', 'Full House') AND check_in < ? AND check_out > ?)
         OR (? = 'Full House' AND room_id != 'Self Catering' AND room_id != 'Full House' AND check_in < ? AND check_out > ?)
       )
       LIMIT 1`
    ).bind(room_id, check_out, check_in, room_id, check_out, check_in, room_id, check_out, check_in).all();

    if (conflictingBookings.results && conflictingBookings.results.length > 0) {
      return new Response(JSON.stringify({ error: "Room is already booked for these dates" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Insert the booking into D1
    const result = await env.DB.prepare(
      "INSERT INTO bookings (room_id, check_in, check_out, status) VALUES (?, ?, ?, 'confirmed')"
    ).bind(room_id, check_in, check_out).run();

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Booking creation error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
