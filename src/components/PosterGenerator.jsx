import { useState, useRef } from "react";
import { Download, Camera as ImageIcon, Loader2, FileImage, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const PosterGenerator = ({ scheduleItems, theme, planName }) => {
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  function escapeXML(text) {
    return text.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&apos;");
  }

  
  const generateCanvasPoster = async () => {
    setGenerating(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      
      const scale = 2;
      canvas.width = 800 * scale;
      canvas.height = 1200 * scale;
      ctx.scale(scale, scale);

      
      ctx.fillStyle = getThemeColor();
      ctx.fillRect(0, 0, 800, 1200);

      
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      const themeColors = getThemeGradientColors();
      gradient.addColorStop(0, themeColors.start);
      gradient.addColorStop(1, themeColors.end);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 300);

      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 42px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
      
      
      const title = planName || 'My Weekend Plan';
      const maxTitleWidth = 700;
      let fontSize = 42;
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      
      
      while (ctx.measureText(title).width > maxTitleWidth && fontSize > 28) {
        fontSize -= 2;
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      }
      
      
      const words = title.split(' ');
      const lines = [];
      let currentLine = words[0];
      
      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        const testWidth = ctx.measureText(testLine).width;
        
        if (testWidth > maxTitleWidth) {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);
      
      
      let titleY = 100;
      const lineHeight = fontSize * 1.2;
      if (lines.length > 1) {
        titleY = 100 - ((lines.length - 1) * lineHeight) / 2;
      }
      
      lines.forEach((line, index) => {
        ctx.fillText(line, 400, titleY + (index * lineHeight));
      });

      
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      
      const badgeY = titleY + (lines.length * lineHeight) + 20;
      const badgeText = `${theme.toUpperCase()} THEME`;
      ctx.font = '18px Arial, sans-serif';
      const badgeWidth = ctx.measureText(badgeText).width + 40;
      
      
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.beginPath();
      ctx.roundRect(400 - badgeWidth/2, badgeY - 15, badgeWidth, 30, 15);
      ctx.fill();
      
      
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, 400, badgeY + 5);

      
      let yPos = 360;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#1a1a1a';

      
      const groupedByDay = scheduleItems.reduce((acc, item) => {
        if (!acc[item.day]) acc[item.day] = [];
        acc[item.day].push(item);
        return acc;
      }, {});

      
      Object.entries(groupedByDay).forEach(([day, items]) => {
        
        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 32px Arial, sans-serif';
        ctx.fillText(day.charAt(0).toUpperCase() + day.slice(1), 60, yPos);
        
        
        ctx.strokeStyle = themeColors.start;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(60, yPos + 10);
        ctx.lineTo(300, yPos + 10);
        ctx.stroke();
        
        yPos += 55;

        
        items.sort((a, b) => a.startTime.localeCompare(b.startTime)).forEach((item, index) => {
          
          ctx.fillStyle = 'rgba(0,0,0,0.05)';
          ctx.beginPath();
          ctx.roundRect(65, yPos - 25, 680, 80, 15);
          ctx.fill();
          
          
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.roundRect(60, yPos - 30, 680, 80, 15);
          ctx.fill();
          
          
          ctx.strokeStyle = '#e5e7eb';
          ctx.lineWidth = 1;
          ctx.stroke();

          
          const iconX = 90;
          const iconY = yPos + 10;
          
          
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.arc(iconX, iconY - 15, 25, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#e2e8f0';
          ctx.stroke();
          
          
          ctx.font = '28px Arial, sans-serif';
          ctx.fillStyle = '#1a1a1a';
          ctx.textAlign = 'center';
          ctx.fillText(item.activity?.icon || '📅', iconX, iconY - 5);

          
          ctx.textAlign = 'left';
          
          
          ctx.font = 'bold 20px Arial, sans-serif';
          ctx.fillStyle = '#1a1a1a';
          const activityName = item.activity?.name || 'Activity';
          ctx.fillText(activityName, 140, yPos - 8);
          
       
          ctx.font = '15px Arial, sans-serif';
          ctx.fillStyle = '#6b7280';
          const description = item.activity?.description || 'No description';
          const maxDescLength = 50;
          const truncatedDesc = description.length > maxDescLength 
            ? description.substring(0, maxDescLength) + '...' 
            : description;
          ctx.fillText(truncatedDesc, 140, yPos + 15);
          
       
          const timeText = item.startTime || '00:00';
          ctx.font = 'bold 16px Arial, sans-serif';
          const timeMetrics = ctx.measureText(timeText);
          const timeWidth = timeMetrics.width;
          const badgeX = 680 - timeWidth - 20;
          const badgeY = yPos - 18;
          
          
          const timeBadgeGradient = ctx.createLinearGradient(badgeX, badgeY, badgeX, badgeY + 28);
          timeBadgeGradient.addColorStop(0, themeColors.start + '20'); 
          timeBadgeGradient.addColorStop(1, themeColors.end + '20');
          ctx.fillStyle = timeBadgeGradient;
          ctx.beginPath();
          ctx.roundRect(badgeX, badgeY, timeWidth + 20, 28, 14);
          ctx.fill();
          
          
          ctx.strokeStyle = themeColors.start;
          ctx.lineWidth = 1;
          ctx.stroke();
          
          
          ctx.fillStyle = '#374151';
          ctx.textAlign = 'center';
          ctx.fillText(timeText, badgeX + (timeWidth + 20) / 2, badgeY + 19);

          yPos += 100;
        });
        yPos += 30;
      });

      
      const footerY = 1150;
      ctx.strokeStyle = themeColors.start;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(300, footerY - 20);
      ctx.lineTo(500, footerY - 20);
      ctx.stroke();
      
      ctx.fillStyle = '#9ca3af';
      ctx.font = '16px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Created with Weekendly', 400, footerY);

      
      const link = document.createElement("a");
      link.download = `${(planName || "weekend-plan").replace(/[^a-z0-9]/gi, '-').toLowerCase()}-poster.png`;
      link.href = canvas.toDataURL('image/png', 0.95);
      link.click();

      toast.success("High-quality poster generated!");
    } catch (error) {
      console.error("Canvas generation failed:", error);
      toast.error("Failed to generate poster: " + error.message);
    } finally {
      setGenerating(false);
    }
  };

  
  const generateSVGPoster = async () => {
    setGenerating(true);
    try {
      const themeColors = getThemeGradientColors();
      const groupedByDay = scheduleItems.reduce((acc, item) => {
        if (!acc[item.day]) acc[item.day] = [];
        acc[item.day].push(item);
        return acc;
      }, {});

      let yPos = 360;
      let activitiesHTML = '';
      
      Object.entries(groupedByDay).forEach(([day, items]) => {
        
        activitiesHTML += `
          <text x="60" y="${yPos}" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#1a1a1a">
            ${day.charAt(0).toUpperCase() + day.slice(1)}
          </text>
          <line x1="60" y1="${yPos + 10}" x2="300" y2="${yPos + 10}" stroke="${themeColors.start}" stroke-width="4"/>
        `;
        yPos += 55;

        items.sort((a, b) => a.startTime.localeCompare(b.startTime)).forEach(item => {
          
          activitiesHTML += `
            <rect x="60" y="${yPos - 30}" width="680" height="80" rx="15" fill="white" stroke="#e5e7eb" stroke-width="1"/>
            <circle cx="90" cy="${yPos + 10 - 15}" r="25" fill="#f8fafc" stroke="#e2e8f0"/>
            <text x="90" y="${yPos + 10 - 5}" font-family="Arial, sans-serif" font-size="28" text-anchor="middle" fill="#1a1a1a">
              ${item.activity?.icon || '📅'}
            </text>
            <text x="140" y="${yPos - 8}" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#1a1a1a">
              ${escapeXML(item.activity?.name || 'Activity')}
            </text>
            <text x="140" y="${yPos + 15}" font-family="Arial, sans-serif" font-size="15" fill="#6b7280">
              ${escapeXML((item.activity?.description || 'No description').substring(0, 50))}
            </text>
            <rect x="600" y="${yPos - 18}" width="80" height="28" rx="14" fill="${themeColors.start}20" stroke="${themeColors.start}"/>
            <text x="640" y="${yPos - 1}" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#374151">
              ${item.startTime || '00:00'}
            </text>
          `;
          yPos += 100;
        });
        yPos += 30;
      });

      const svgContent = `
        <svg width="800" height="1200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="headerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:${themeColors.start};stop-opacity:0.8" />
              <stop offset="100%" style="stop-color:${themeColors.end};stop-opacity:0.8" />
            </linearGradient>
          </defs>
          
          <!-- Background -->
          <rect width="800" height="1200" fill="${getThemeColor()}"/>
          
          <!-- Header Background -->
          <rect width="800" height="300" fill="url(#headerGradient)"/>
          
          <!-- Title -->
          <text x="400" y="120" font-family="Arial, sans-serif" font-size="42" font-weight="bold" 
                text-anchor="middle" fill="white" style="text-shadow: 0 4px 8px rgba(0,0,0,0.3)">
            ${planName || "My Weekend Plan"}
          </text>
          
          <!-- Theme Badge -->
          <rect x="300" y="140" width="200" height="30" rx="15" fill="rgba(255,255,255,0.25)"/>
          <text x="400" y="160" font-family="Arial, sans-serif" font-size="18" font-weight="600" 
                text-anchor="middle" fill="white" letter-spacing="2px">
            ${theme.toUpperCase()} THEME
          </text>
          
          <!-- Activities -->
          ${activitiesHTML}
          
          <!-- Footer -->
          <line x1="300" y1="1130" x2="500" y2="1130" stroke="${themeColors.start}" stroke-width="2"/>
          <text x="400" y="1150" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#9ca3af">
            Created with Weekendly
          </text>
        </svg>
      `;

      
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${(planName || "weekend-plan").replace(/[^a-z0-9]/gi, '-').toLowerCase()}-poster.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("SVG poster generated! (Scalable vector format)");
    } catch (error) {
      console.error("SVG generation failed:", error);
      toast.error("Failed to generate SVG: " + error.message);
    } finally {
      setGenerating(false);
    }
  };

  

  

  const getThemeColor = () => {
    switch (theme) {
      case "lazy": return "#f8fafc";
      case "adventurous": return "#fef7f0"; 
      case "family": return "#f0f9ff";
      default: return "#ffffff";
    }
  };

  const getThemeGradientColors = () => {
    switch (theme) {
      case "lazy": return { start: "#667eea", end: "#764ba2" };
      case "adventurous": return { start: "#f093fb", end: "#f5576c" };
      case "family": return { start: "#4facfe", end: "#00f2fe" };
      default: return { start: "#667eea", end: "#764ba2" };
    }
  };

  if (!scheduleItems || scheduleItems.length === 0) {
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Generate Weekend Poster
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Choose your preferred export format. Each method has different advantages:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button 
              onClick={generateCanvasPoster} 
              disabled={generating} 
              className="gap-2 flex-col h-auto py-4"
              variant="default"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileImage className="h-4 w-4" />}
              <div>
                <div className="font-semibold">Canvas PNG</div>
                <div className="text-xs opacity-90">High quality image</div>
              </div>
            </Button>
            
            <Button 
              onClick={generateSVGPoster} 
              disabled={generating} 
              variant="outline"
              className="gap-2 flex-col h-auto py-4"
            >
              <Code className="h-4 w-4" />
              <div>
                <div className="font-semibold">SVG Vector</div>
                <div className="text-xs opacity-75">Scalable graphics</div>
              </div>
            </Button>
            
            {/* <Button 
              onClick={generatePrintHTML} 
              disabled={generating} 
              variant="outline"
              className="gap-2 flex-col h-auto py-4"
            >
              <Download className="h-4 w-4" />
              <div>
                <div className="font-semibold">Print HTML</div>
                <div className="text-xs opacity-75">Browser printable</div>
              </div>
            </Button> */}
          </div>
          
          {generating && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Generating your poster... This may take a moment for high quality output.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Preview</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Hide' : 'Show'} Preview
            </Button>
          </CardTitle>
        </CardHeader>
        {showPreview && (
          <CardContent>
            <div className="border rounded-lg p-4 bg-gray-50 overflow-y-auto" style={{ 
              width: '400px', 
              height: '600px', 
              margin: '0 auto',
              background: `linear-gradient(135deg, ${getThemeGradientColors().start}20, ${getThemeGradientColors().end}20)`
            }}>
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-center">{planName || "My Weekend Plan"}</h3>
                <div className="text-sm bg-white/50 rounded px-2 py-1 inline-block mt-2">
                  {theme.toUpperCase()} THEME
                </div>
              </div>
              <div className="space-y-3">
                {Object.entries(scheduleItems.reduce((acc, item) => {
                  if (!acc[item.day]) acc[item.day] = [];
                  acc[item.day].push(item);
                  return acc;
                }, {})).map(([day, items]) => (
                  <div key={day} className="border-l-2 pl-3" style={{ borderLeftColor: getThemeGradientColors().start }}>
                    <h4 className="font-semibold text-sm capitalize text-left">{day}</h4>
                    {items.slice(0, 2).map((item, i) => (
                      <div key={i} className="text-xs bg-white/70 rounded p-2 mt-1 flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-2">{item.activity?.icon}</span>
                          <span className="font-medium">{item.activity?.name}</span>
                        </div>
                        <span className="text-gray-600 ml-2">{item.startTime}</span>
                      </div>
                    ))}
                    {items.length > 2 && (
                      <div className="text-xs text-gray-500 mt-1 text-left">
                        +{items.length - 2} more activities
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default PosterGenerator;