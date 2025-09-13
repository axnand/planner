export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${googleApiKey}`
  );
  const data = await response.json();

  const places = (data.results || []).slice(0, 5).map((place, index) => ({
    id: `restaurant-${index}`,
    name: place.name,
    description: `${place.types?.join(", ") || "Restaurant"} - ${place.formatted_address}`,
    category: "food",
    icon: "🍽️",
    estimatedTime: 90,
    source: "restaurants",
    location: place.formatted_address,
    rating: place.rating,
    price: place.price_level ? "$".repeat(place.price_level) : undefined,
    lat: place.geometry?.location?.lat,
    lng: place.geometry?.location?.lng,
    photo: place.photos?.[0]?.photo_reference
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${googleApiKey}`
      : null,
  }));

  return new Response(JSON.stringify({ results: places }), {
    headers: { "Content-Type": "application/json" },
  });
}

