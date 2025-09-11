import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch weather");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Weather API error:", err);
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
}
