import { useState, useEffect } from "react";
import { MapPin, Calendar, Cloud, Loader2, Utensils, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const SmartIntegrations = ({ onAddActivity, onClose, theme, currentLocation }) => {

  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSource, setActiveSource] = useState(null);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    googlePlaces: localStorage.getItem("googlePlaces") || "",
    openWeather: localStorage.getItem("openWeather") || "",
  });




  useEffect(() => {
  if (currentLocation) {
    fetchWeatherSuggestions();
  }
}, [currentLocation]);


  const fetchRestaurants = async () => {
  if (!location) {
    toast.error("Please enter a location");
    return;
  }

  setLoading(true);
  setActiveSource("restaurants");

  try {
    // Call your API route (key handled server-side, not here!)
    const response = await fetch(
      `/api/places?query=restaurants+in+${encodeURIComponent(location)}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from API route");
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const restaurantSuggestions = data.results.slice(0, 5).map((place, index) => ({
        id: `restaurant-${index}`,
        name: place.name,
        description: `${place.types?.join(", ") || "Restaurant"} - ${
          place.formatted_address || place.vicinity
        }`,
        category: "food",
        icon: "🍽️",
        estimatedTime: 90,
        source: "restaurants",
        location: place.formatted_address || place.vicinity,
        rating: place.rating,
        price: place.price_level ? "$".repeat(place.price_level) : undefined,
        themes: [theme],
        isIndoor: true,
        mood: "happy",
      }));

      // Replace only restaurant suggestions
      setSuggestions((prev) => [
        ...prev.filter((s) => s.source !== "restaurants"),
        ...restaurantSuggestions,
      ]);

      toast.success(`Found ${restaurantSuggestions.length} restaurants!`);
    } else {
      toast.error("No restaurants found in this location");
    }
  } catch (error) {
    console.error("Restaurant fetch error:", error);
    toast.error("Failed to fetch restaurants.");
  } finally {
    setLoading(false);
  }
};


  const fetchWeatherSuggestions = async () => {
  if (!currentLocation) {
    toast.error("Location not available");
    return;
  }

  setLoading(true);
  setActiveSource("weather");

  try {
    const response = await fetch(
      `/api/weather?lat=${currentLocation.lat}&lon=${currentLocation.lng}`
    );

    if (!response.ok) throw new Error("Failed to fetch weather");

    const data = await response.json();
    if (data.weather) {
      const weather = data.weather[0];
      const temp = data.main.temp;
      const weatherBased = getWeatherBasedSuggestions(weather.main, temp);

      setSuggestions((prev) => [
        ...prev.filter((s) => s.source !== "weather"),
        ...weatherBased,
      ]);

      toast.success("Weather-based ideas loaded!");
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch weather ideas");
    setSuggestions((prev) => prev.filter((s) => s.source !== "weather"));
  } finally {
    setLoading(false);
  }
};


  const getWeatherBasedSuggestions = (weatherMain, temp) => {
    const suggestions = [];

    if (["Clear", "Clouds"].includes(weatherMain) && temp > 20) {
      suggestions.push({
        id: "weather-outdoor-1",
        name: "Outdoor Picnic",
        description: `Perfect weather (${weatherMain}, ${temp}°C) for outdoor activities`,
        category: "outdoor",
        icon: "☀️",
        estimatedTime: 180,
        source: "weather",
        weather: `${weatherMain}, ${temp}°C`,
        themes: [theme],
        isIndoor: false,
        mood: "energized"
      });
      
      suggestions.push({
        id: "weather-outdoor-2", 
        name: "Park Walk",
        description: `Beautiful ${temp}°C weather for a relaxing walk`,
        category: "outdoor",
        icon: "🚶",
        estimatedTime: 60,
        source: "weather",
        weather: `${weatherMain}, ${temp}°C`,
        themes: [theme],
        isIndoor: false,
        mood: "relaxed"
      });
    } else if (["Rain", "Drizzle", "Thunderstorm"].includes(weatherMain)) {
      suggestions.push({
        id: "weather-indoor-1",
        name: "Cozy Cafe Visit",
        description: `Rainy weather - perfect for a warm cafe`,
        category: "indoor",
        icon: "☕",
        estimatedTime: 120,
        source: "weather",
        weather: `${weatherMain}, ${temp}°C`,
        themes: [theme],
        isIndoor: true,
        mood: "relaxed"
      });
      
      suggestions.push({
        id: "weather-indoor-2",
        name: "Museum Visit",
        description: `Stay dry and explore local culture`,
        category: "entertainment",
        icon: "🏛️",
        estimatedTime: 150,
        source: "weather",
        weather: `${weatherMain}, ${temp}°C`,
        themes: [theme],
        isIndoor: true,
        mood: "happy"
      });
    } else if (temp < 10) {
      suggestions.push({
        id: "weather-warm-1",
        name: "Warm Indoor Activities",
        description: `Cold weather (${temp}°C) - stay cozy inside`,
        category: "wellness",
        icon: "🔥",
        estimatedTime: 90,
        source: "weather",
        weather: `${weatherMain}, ${temp}°C`,
        themes: [theme],
        isIndoor: true,
        mood: "relaxed"
      });
    } else {
      suggestions.push({
        id: "weather-generic",
        name: "Relaxing Walk",
        description: `Weather: ${weatherMain}, ${temp}°C. A simple walk works well!`,
        category: "outdoor",
        icon: "🚶",
        estimatedTime: 60,
        source: "weather",
        weather: `${weatherMain}, ${temp}°C`,
        themes: [theme],
        isIndoor: false,
        mood: "happy"
      });
    }

    return suggestions;
  };

  const fetchEvents = () => {
    setActiveSource("events");
    
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
        themes: [theme],
        isIndoor: true,
        mood: "happy"
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
        themes: [theme],
        isIndoor: false,
        mood: "energized"
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
        themes: [theme],
        isIndoor: false,
        mood: "energized"
      },
    ];
    
    // Replace only event suggestions
    setSuggestions(prev => [
      ...prev.filter(s => s.source !== "events"),
      ...mockEvents
    ]);
    
    toast.success("Local events loaded!");
  };

  const handleAddSuggestion = (suggestion) => {
    const activity = {
      id: suggestion.id,
      name: suggestion.name,
      category: suggestion.category,
      description: suggestion.description,
      icon: suggestion.icon,
      estimatedTime: suggestion.estimatedTime,
      mood: suggestion.mood || "happy",
      themes: suggestion.themes || [theme],
      isIndoor: suggestion.isIndoor,
    };

    onAddActivity(activity);
    toast.success(`Added "${suggestion.name}" to your plan!`);
  };

  const saveApiKey = (key, value) => {
    localStorage.setItem(key, value);
    setApiKeys(prev => ({ ...prev, [key]: value }));
    toast.success("API key saved!");
  };

  const clearSuggestions = () => {
    setSuggestions([]);
    setActiveSource(null);
    toast.success("Suggestions cleared!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Find Spots Nearby</h2>
          <p className="text-muted-foreground">
            Discover restaurants, events, and weather-based activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setShowApiConfig(!showApiConfig)}>
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location
          </CardTitle>
          <CardDescription>Enter your location for restaurant suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your location (e.g., New York, NY)"
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={fetchRestaurants} 
          disabled={loading} 
          className="gap-2"
        >
          <Utensils className="h-4 w-4" />
          Find Restaurants
        </Button>
        
        <Button
          onClick={fetchEvents}
          disabled={loading}
          variant="outline"
          className="gap-2"
        >
          <Calendar className="h-4 w-4" />
          Find Events
        </Button>
        
        <Button
          onClick={fetchWeatherSuggestions}
          disabled={loading}
          variant="outline"
          className="gap-2"
        >
          <Cloud className="h-4 w-4" />
          Weather Ideas
        </Button>

        {suggestions.length > 0 && (
          <Button onClick={clearSuggestions} variant="destructive" size="sm">
            Clear All
          </Button>
        )}
      </div>

      {/* Active Source Indicator */}
      {activeSource && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            Showing {activeSource} suggestions
          </Badge>
          <span className="text-sm text-muted-foreground">
            ({suggestions.filter(s => s.source === activeSource).length} items)
          </span>
        </div>
      )}

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
                  <span className="text-xs text-muted-foreground">
                    ~{suggestion.estimatedTime} min
                  </span>
                  <Button 
                    size="sm" 
                    onClick={() => handleAddSuggestion(suggestion)} 
                    className="gap-1"
                  >
                    Add to Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {suggestions.length === 0 && (
  <Card>
    <CardContent className="text-center py-8">
      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">No suggestions yet</h3>
      <p className="text-muted-foreground">
        Use the buttons above to discover nearby spots!
      </p>
    </CardContent>
  </Card>
)}

    </div>
  );
};

export default SmartIntegrations;