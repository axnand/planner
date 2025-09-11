import { useState, useRef } from "react";
import { Download, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import html2canvas from "html2canvas";

const PosterGenerator = ({ scheduleItems, theme, planName }) => {
  const [generating, setGenerating] = useState(false);
  const posterRef = useRef(null);

  const generatePoster = async () => {
    setGenerating(true);
    try {
      // Method 1: Use a visible poster element that gets rendered in the DOM
      const posterElement = posterRef.current;
      
      if (!posterElement) {
        throw new Error("Poster element not found");
      }

      // Wait for any images or fonts to load
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate canvas with simplified options
      const canvas = await html2canvas(posterElement, {
        width: 800,
        height: 1200,
        scale: 1, // Reduced scale to avoid memory issues
        backgroundColor: getThemeColor(),
        useCORS: true,
        allowTaint: true,
        logging: false, // Disable logging
        foreignObjectRendering: false, // Disable foreign object rendering
        removeContainer: true,
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          // Clean up any problematic styles in the cloned document
          const clonedElement = clonedDoc.getElementById('poster-content');
          if (clonedElement) {
            // Remove any CSS variables or complex selectors
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach(el => {
              const style = el.style;
              // Remove any CSS that might cause issues
              if (style.background && (style.background.includes('var(') || style.background.includes('lab('))) {
                style.background = getThemeColor();
              }
              if (style.color && (style.color.includes('var(') || style.color.includes('lab('))) {
                style.color = '#000000';
              }
            });
          }
        }
      });

      // Download image
      const link = document.createElement("a");
      link.download = `${(planName || "weekend-plan").replace(/[^a-z0-9]/gi, '-').toLowerCase()}-poster.png`;
      link.href = canvas.toDataURL('image/png', 0.8);
      link.click();

      toast.success("Poster generated successfully!");
    } catch (error) {
      console.error("Error generating poster:", error);
      // Try fallback method
      await generateSimplePoster();
    } finally {
      setGenerating(false);
    }
  };

  // Fallback method using pure Canvas API
  const generateSimplePoster = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 800;
      canvas.height = 1200;

      // Background
      ctx.fillStyle = getThemeColor();
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header background gradient (simplified)
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      const themeColors = getThemeGradientColors();
      gradient.addColorStop(0, themeColors.start);
      gradient.addColorStop(1, themeColors.end);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 300);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(planName || 'My Weekend Plan', 400, 120);

      // Theme subtitle
      ctx.font = '18px Arial, sans-serif';
      ctx.fillText(`${theme.toUpperCase()} THEME`, 400, 160);

      // Schedule items
      const groupedByDay = scheduleItems.reduce((acc, item) => {
        if (!acc[item.day]) acc[item.day] = [];
        acc[item.day].push(item);
        return acc;
      }, {});

      let yPos = 350;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#1a1a1a';

      Object.entries(groupedByDay).forEach(([day, items]) => {
        // Day header
        ctx.font = 'bold 24px Arial, sans-serif';
        ctx.fillText(day.charAt(0).toUpperCase() + day.slice(1), 60, yPos);
        yPos += 40;

        // Activities
        ctx.font = '16px Arial, sans-serif';
        items.sort((a, b) => a.startTime.localeCompare(b.startTime)).forEach(item => {
          // Activity background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(60, yPos - 25, 680, 60);
          
          // Activity border
          ctx.strokeStyle = '#e5e7eb';
          ctx.lineWidth = 1;
          ctx.strokeRect(60, yPos - 25, 680, 60);

          // Activity text
          ctx.fillStyle = '#1a1a1a';
          ctx.font = 'bold 18px Arial, sans-serif';
          ctx.fillText(`${item.activity.icon} ${item.activity.name}`, 80, yPos);
          
          ctx.fillStyle = '#6b7280';
          ctx.font = '14px Arial, sans-serif';
          ctx.fillText(item.activity.description, 80, yPos + 20);
          
          // Time
          ctx.fillStyle = '#374151';
          ctx.font = 'bold 14px Arial, sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(item.startTime, 720, yPos + 5);
          ctx.textAlign = 'left';

          yPos += 80;
        });
        yPos += 20;
      });

      // Footer
      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Created with Weekendly', 400, 1160);

      // Download
      const link = document.createElement("a");
      link.download = `${(planName || "weekend-plan").replace(/[^a-z0-9]/gi, '-').toLowerCase()}-poster.png`;
      link.href = canvas.toDataURL('image/png', 0.8);
      link.click();

      toast.success("Poster generated using fallback method!");
    } catch (error) {
      console.error("Fallback poster generation failed:", error);
      toast.error("Failed to generate poster. Please try again.");
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

  const getThemeGradientColors = () => {
    switch (theme) {
      case "lazy":
        return { start: "#667eea", end: "#764ba2" };
      case "adventurous":
        return { start: "#f093fb", end: "#f5576c" };
      case "family":
        return { start: "#4facfe", end: "#00f2fe" };
      default:
        return { start: "#667eea", end: "#764ba2" };
    }
  };

  const getThemeGradient = () => {
    const colors = getThemeGradientColors();
    return `linear-gradient(135deg, ${colors.start} 0%, ${colors.end} 100%)`;
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

  const groupedByDay = scheduleItems.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
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
          <div className="flex gap-2">
            <Button onClick={generatePoster} disabled={generating} className="gap-2">
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {generating ? "Generating..." : "Generate Poster"}
            </Button>
            
            <Button 
              onClick={generateSimplePoster} 
              disabled={generating} 
              variant="outline" 
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Simple Version
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hidden poster element for html2canvas */}
      <div className="fixed -left-[9999px] top-0 opacity-0 pointer-events-none">
        <div 
          ref={posterRef}
          id="poster-content"
          style={{
            width: '800px',
            height: '1200px',
            backgroundColor: getThemeColor(),
            fontFamily: 'Arial, sans-serif',
            padding: '60px',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Header Background */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '300px',
            background: getThemeGradient(),
            opacity: '0.8'
          }}></div>
          
          {/* Header Content */}
          <div style={{ position: 'relative', zIndex: '2', textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '800',
              color: '#ffffff',
              margin: '0 0 20px 0',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              lineHeight: '1.2'
            }}>
              {planName || "My Weekend Plan"}
            </h1>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '20px',
              padding: '15px 30px',
              display: 'inline-block'
            }}>
              <p style={{
                fontSize: '24px',
                color: '#ffffff',
                margin: '0',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                {theme} Theme
              </p>
            </div>
          </div>

          {/* Schedule Content */}
          <div style={{ position: 'relative', zIndex: '2' }}>
            {Object.entries(groupedByDay).map(([day, items]) => (
              <div key={day} style={{ marginBottom: '40px' }}>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  margin: '0 0 20px 0',
                  textTransform: 'capitalize',
                  borderBottom: '3px solid #e5e7eb',
                  paddingBottom: '10px'
                }}>
                  {day}
                </h2>
                <div style={{ display: 'grid', gap: '15px' }}>
                  {items.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((item, index) => (
                    <div key={`${day}-${index}`} style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '15px',
                      padding: '20px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{
                        fontSize: '36px',
                        minWidth: '50px',
                        textAlign: 'center'
                      }}>
                        {item.activity.icon}
                      </div>
                      <div style={{ flex: '1' }}>
                        <h3 style={{
                          fontSize: '20px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          margin: '0 0 8px 0',
                          lineHeight: '1.3'
                        }}>
                          {item.activity.name}
                        </h3>
                        <p style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          margin: '0',
                          lineHeight: '1.4'
                        }}>
                          {item.activity.description}
                        </p>
                      </div>
                      <div style={{
                        backgroundColor: '#f3f4f6',
                        borderRadius: '10px',
                        padding: '8px 15px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        {item.startTime}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '16px',
              color: '#9ca3af',
              margin: '0',
              fontWeight: '500'
            }}>
              Created with Weekendly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterGenerator;