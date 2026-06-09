export async function onRequestPost(context) {
  const { env } = context;
  
  try {
    const data = await context.request.json();
    const { 
      room_id, 
      check_in, 
      check_out, 
      guest_name, 
      guest_email, 
      guest_phone, 
      location, 
      guests_count, 
      source, 
      special_requests 
    } = data;

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
       AND check_in < ? 
       AND check_out > ? 
       AND (
         room_id = ?
         OR ? = 'Full House Complete'
         OR room_id = 'Full House Complete'
         OR (? = 'Full House' AND room_id NOT IN ('Self Catering', 'Full House', 'Full House Complete'))
         OR (room_id = 'Full House' AND ? NOT IN ('Self Catering', 'Full House', 'Full House Complete'))
       )
       LIMIT 1`
    ).bind(check_out, check_in, room_id, room_id, room_id, room_id).all();

    if (conflictingBookings.results && conflictingBookings.results.length > 0) {
      return new Response(JSON.stringify({ error: "Room is already booked for these dates" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Insert the booking into D1
    const result = await env.DB.prepare(
      `INSERT INTO bookings (
        room_id, check_in, check_out, guest_name, guest_email, 
        guest_phone, location, guests_count, source, special_requests, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')`
    ).bind(
      room_id, check_in, check_out, guest_name || null, guest_email || null, 
      guest_phone || null, location || null, guests_count || 1, source || 'Website', 
      special_requests || null
    ).run();

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
