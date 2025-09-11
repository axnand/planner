import { useState } from "react";
import { Download, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import html2canvas from "html2canvas";

const PosterGenerator = ({ scheduleItems, theme, planName }) => {
  const [generating, setGenerating] = useState(false);

  const generatePoster = async () => {
    setGenerating(true);
    try {
      // Create the poster element
      const posterElement = document.createElement("div");
      posterElement.innerHTML = createPosterHTML();
      posterElement.style.position = "absolute";
      posterElement.style.left = "-9999px";
      posterElement.style.width = "800px";
      posterElement.style.height = "1200px";
      document.body.appendChild(posterElement);

      // Generate canvas
      const canvas = await html2canvas(posterElement, {
        width: 800,
        height: 1200,
        scale: 2,
        backgroundColor: getThemeColor(),
      });

      // Download image
      const link = document.createElement("a");
      link.download = `${planName || "weekend-plan"}-poster.png`;
      link.href = canvas.toDataURL();
      link.click();

      // Cleanup
      document.body.removeChild(posterElement);
      toast.success("Poster generated successfully!");
    } catch (error) {
      console.error("Error generating poster:", error);
      toast.error("Failed to generate poster");
    } finally {
      setGenerating(false);
    }
  };

  const getThemeColor = () => {
    switch (theme) {
      case "lazy":
        return "#f8fafc";
      case "adventurous":
        return "#fef7f0";
      case "family":
        return "#f0f9ff";
      default:
        return "#ffffff";
    }
  };

  const getThemeGradient = () => {
    switch (theme) {
      case "lazy":
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      case "adventurous":
        return "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";
      case "family":
        return "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)";
      default:
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    }
  };

  const createPosterHTML = () => {
    const groupedByDay = scheduleItems.reduce((acc, item) => {
      if (!acc[item.day]) acc[item.day] = [];
      acc[item.day].push(item);
      return acc;
    }, {});

    return `
      <div style="
        width: 800px;
        height: 1200px;
        background: ${getThemeColor()};
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        padding: 60px;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
      ">
        <!-- Background Pattern -->
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 300px;
          background: ${getThemeGradient()};
          opacity: 0.8;
        "></div>
        
        <!-- Header -->
        <div style="position: relative; z-index: 2; text-align: center; margin-bottom: 60px;">
          <h1 style="
            font-size: 48px;
            font-weight: 800;
            color: white;
            margin: 0 0 20px 0;
            text-shadow: 0 4px 8px rgba(0,0,0,0.3);
          ">${planName || "My Weekend Plan"}</h1>
          <div style="
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 15px 30px;
            display: inline-block;
          ">
            <p style="
              font-size: 24px;
              color: white;
              margin: 0;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 2px;
            ">${theme} Theme</p>
          </div>
        </div>

        <!-- Schedule -->
        <div style="position: relative; z-index: 2;">
          ${Object.entries(groupedByDay)
            .map(
              ([day, items]) => `
            <div style="margin-bottom: 40px;">
              <h2 style="
                font-size: 32px;
                font-weight: 700;
                color: #1a1a1a;
                margin: 0 0 20px 0;
                text-transform: capitalize;
                border-bottom: 3px solid #e5e7eb;
                padding-bottom: 10px;
              ">${day}</h2>
              <div style="display: grid; gap: 15px;">
                ${items
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map(
                    (item) => `
                  <div style="
                    background: white;
                    border-radius: 15px;
                    padding: 20px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                    gap: 20px;
                  ">
                    <div style="
                      font-size: 36px;
                      min-width: 50px;
                    ">${item.activity.icon}</div>
                    <div style="flex: 1;">
                      <h3 style="
                        font-size: 20px;
                        font-weight: 600;
                        color: #1a1a1a;
                        margin: 0 0 8px 0;
                      ">${item.activity.name}</h3>
                      <p style="
                        font-size: 14px;
                        color: #6b7280;
                        margin: 0;
                      ">${item.activity.description}</p>
                    </div>
                    <div style="
                      background: #f3f4f6;
                      border-radius: 10px;
                      padding: 8px 15px;
                      font-size: 14px;
                      font-weight: 600;
                      color: #374151;
                    ">${item.startTime}</div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <!-- Footer -->
        <div style="
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
        ">
          <p style="
            font-size: 16px;
            color: #9ca3af;
            margin: 0;
            font-weight: 500;
          ">Created with Weekendly</p>
        </div>
      </div>
    `;
  };

  if (scheduleItems.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No activities to display
          </h3>
          <p className="text-muted-foreground">
            Add some activities to your plan to generate a poster
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Generate Weekend Poster
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Create a beautiful poster of your weekend plan to share or print
        </p>
        <Button onClick={generatePoster} disabled={generating} className="gap-2">
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {generating ? "Generating..." : "Generate Poster"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PosterGenerator;
