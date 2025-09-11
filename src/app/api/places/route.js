export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  const googleApiKey = process.env.GOOGLE_PLACES_API_KEY; // use env variable
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${googleApiKey}`
  );

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
