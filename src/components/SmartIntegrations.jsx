import { useState, useEffect } from "react";
import { MapPin, Calendar, Cloud, Loader2, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const SmartIntegrations = ({ onAddActivity, onClose, theme, currentLocation }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [apiKeys, setApiKeys] = useState({
    googlePlaces: localStorage.getItem("googlePlacesApiKey") || "",
    openWeather: localStorage.getItem("openWeatherApiKey") || "",
  });

  useEffect(() => {
    if (currentLocation) {
      fetchWeatherSuggestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation]);

  const fetchRestaurants = async () => {
  if (!apiKeys.googlePlaces || !location) {
    toast.error("Please enter your Google Places API key and location");
    return;
  }

  setLoading(true);
  try {
    // Call your Next.js API route instead of Google directly
    const response = await fetch(`/api/places?query=restaurants+in+${location}`);
    if (!response.ok) {
      throw new Error("Failed to fetch from API route");
    }
    const data = await response.json();

    if (data.results) {
      const restaurantSuggestions = data.results.slice(0, 5).map((place, index) => ({
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
      }));

      setSuggestions((prev) => [
        ...prev.filter((s) => s.source !== "restaurants"),
        ...restaurantSuggestions,
      ]);
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch restaurants");
  } finally {
    setLoading(false);
  }
};


  const fetchWeatherSuggestions = async () => {
    if (!apiKeys.openWeather || !currentLocation) return;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${currentLocation.lat}&lon=${currentLocation.lng}&appid=${apiKeys.openWeather}&units=metric`
      );
      const data = await response.json();

      if (data.weather) {
        const weather = data.weather[0];
        const temp = data.main.temp;
        const weatherSuggestions = getWeatherBasedSuggestions(weather.main, temp);

        setSuggestions((prev) => [...prev.filter((s) => s.source !== "weather"), ...weatherSuggestions]);
      }
    } catch (error) {
      console.error("Failed to fetch weather:", error);
    }
  };

  const getWeatherBasedSuggestions = (weatherMain, temp) => {
    const suggestions = [];

    if (weatherMain === "Clear" && temp > 20) {
      suggestions.push({
        id: "weather-outdoor",
        name: "Outdoor Picnic",
        description: `Perfect sunny weather (${temp}°C) for outdoor activities`,
        category: "outdoor",
        icon: "☀️",
        estimatedTime: 180,
        source: "weather",
        weather: `${weatherMain}, ${temp}°C`,
      });
    } else if (weatherMain === "Rain") {
      suggestions.push({
        id: "weather-indoor",
        name: "Cozy Indoor Activities",
        description: `Rainy day - perfect for indoor relaxation`,
        category: "indoor",
        icon: "☔",
        estimatedTime: 120,
        source: "weather",
        weather: `${weatherMain}, ${temp}°C`,
      });
    } else if (temp < 10) {
      suggestions.push({
        id: "weather-warm",
        name: "Warm Indoor Activities",
        description: `Cold weather (${temp}°C) - stay warm indoors`,
        category: "wellness",
        icon: "🔥",
        estimatedTime: 90,
        source: "weather",
        weather: `${weatherMain}, ${temp}°C`,
      });
    }

    return suggestions;
  };

  const fetchEvents = async () => {
    const mockEvents = [
      {
        id: "event-1",
        name: "Local Art Exhibition",
        description: "Contemporary art showcase at the community center",
        category: "entertainment",
        icon: "🎨",
        estimatedTime: 120,
        source: "events",
        location: "Community Art Center",
      },
      {
        id: "event-2",
        name: "Weekend Farmers Market",
        description: "Fresh produce and local crafts",
        category: "social",
        icon: "🥕",
        estimatedTime: 90,
        source: "events",
        location: "Town Square",
      },
      {
        id: "event-3",
        name: "Live Music Performance",
        description: "Local band performing at the park",
        category: "entertainment",
        icon: "🎵",
        estimatedTime: 150,
        source: "events",
        location: "Central Park Amphitheater",
      },
    ];

    setSuggestions((prev) => [...prev.filter((s) => s.source !== "events"), ...mockEvents]);
    toast.success("Found local events!");
  };

  const handleAddSuggestion = (suggestion) => {
    const activity = {
      id: `smart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: suggestion.name,
      category: suggestion.category,
      description: suggestion.description,
      icon: suggestion.icon,
      estimatedTime: suggestion.estimatedTime,
      mood: "happy",
      themes: [theme],
      isIndoor: suggestion.category === "indoor" || suggestion.source === "restaurants",
    };

    onAddActivity(activity);
    toast.success(`Added "${suggestion.name}" to your plan!`);
  };

  const saveApiKey = (key, value) => {
    localStorage.setItem(key, value);
    setApiKeys((prev) => ({ ...prev, [key.replace("ApiKey", "")]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Find Spots Nearby</h2>
          <p className="text-muted-foreground">Discover restaurants, events, and weather-based activities</p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            API Configuration
          </CardTitle>
          <CardDescription>Enter your API keys to enable smart suggestions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Google Places API Key</label>
              <Input
                type="password"
                value={apiKeys.googlePlaces}
                onChange={(e) => saveApiKey("googlePlacesApiKey", e.target.value)}
                placeholder="Enter your Google Places API key"
              />
            </div>
            <div>
              <label className="text-sm font-medium">OpenWeather API Key</label>
              <Input
                type="password"
                value={apiKeys.openWeather}
                onChange={(e) => saveApiKey("openWeatherApiKey", e.target.value)}
                placeholder="Enter your OpenWeather API key"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location (e.g., New York, NY)"
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={fetchRestaurants} disabled={loading || !apiKeys.googlePlaces || !location} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Utensils className="h-4 w-4" />}
          Find Restaurants
        </Button>
        <Button onClick={fetchEvents} variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          Find Events
        </Button>
        <Button
          onClick={fetchWeatherSuggestions}
          disabled={!apiKeys.openWeather || !currentLocation}
          variant="outline"
          className="gap-2"
        >
          <Cloud className="h-4 w-4" />
          Weather Ideas
        </Button>
      </div>

      {/* Suggestions Grid */}
      {suggestions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{suggestion.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{suggestion.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.source}
                        </Badge>
                        {suggestion.rating && (
                          <Badge variant="outline" className="text-xs">
                            ⭐ {suggestion.rating}
                          </Badge>
                        )}
                        {suggestion.price && (
                          <Badge variant="outline" className="text-xs">
                            {suggestion.price}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                {suggestion.location && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {suggestion.location}
                  </p>
                )}
                {suggestion.weather && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Cloud className="h-3 w-3" />
                    {suggestion.weather}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">~{suggestion.estimatedTime} min</span>
                  <Button size="sm" onClick={() => handleAddSuggestion(suggestion)} className="gap-1">
                    Add to Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {suggestions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No suggestions yet</h3>
            <p className="text-muted-foreground">
              Configure your API keys and location, then click the buttons above to discover nearby spots!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartIntegrations;
