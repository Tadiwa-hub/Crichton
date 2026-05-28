export async function onRequest(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  
  // Handle GET request
  if (request.method === 'GET') {
    try {
      // Fetch all confirmed bookings from D1 (including all guest details)
      const { results } = await env.DB.prepare(
        "SELECT * FROM bookings WHERE status = 'confirmed' ORDER BY check_in ASC"
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
  
  // Handle DELETE request for cancellation
  if (request.method === 'DELETE') {
    try {
      const bookingId = url.searchParams.get('id');
      
      if (!bookingId) {
        return new Response(JSON.stringify({ error: "Booking ID required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Delete the booking
      await env.DB.prepare(
        "DELETE FROM bookings WHERE id = ?"
      ).bind(parseInt(bookingId)).run();

      return new Response(JSON.stringify({ success: true, message: "Booking cancelled successfully" }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("D1 Cancel Booking Error:", error.message, error.stack);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}
