import { BarChart3, Calendar, Download, MapPin, Share2, Sparkles } from "lucide-react"
import { Card } from "./ui/card"

export default function Features(){

    const feature =[
        {
          title: "Find Spots Nearby",
          desc: "Discover events, restaurants, and activities suggested based on your location and weather.",
          icon: <MapPin className="h-6 w-6 text-primary" />,
        },
        {
          title: "Smart Activity Suggestions",
          desc: "Personalized activity recommendations that match your vibe — cozy, adventurous, or family time.",
          icon: <Sparkles className="h-6 w-6 text-primary" />,
        },
        {
          title: "Multiple Views",
          desc: "See your weekend plan as a timeline or visualize it with charts for better clarity.",
          icon: <BarChart3 className="h-6 w-6 text-primary" />,
          preview: true,
        },
        {
          title: "Extend Your Weekend",
          desc: "Option to stretch your plans across Friday evening or Monday morning for extra fun.",
          icon: <Calendar className="h-6 w-6 text-primary" />,
        },
        {
          title: "Save & Export",
          desc: "Save your plans securely, export as PDF or poster image, and share with your friends.",
          icon: <Download className="h-6 w-6 text-primary" />,
        },
        {
          title: "Shareable Links",
          desc: "Generate a unique link for each plan so you can invite friends to join instantly.",
          icon: <Share2 className="h-6 w-6 text-primary" />,
        },
      ]
    return(
        <section className="px-6 py-20 bg-gradient-to-b from-background via-muted/20 to-background">
  <div className="mx-auto max-w-7xl">
    {/* Header */}
    <div className="mb-16 text-center space-y-4">
      <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
        All-in-One Weekend Planner
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Smart features to plan, visualize, and share your perfect weekend.
      </p>
    </div>

    {/* Features Grid */}
    <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-3">
      {feature.map((feature, i) => (
        <Card
          key={i}
        
          className="group relative border overflow-hidden bg-[#101010] p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/40 rounded-2xl"
        >
          {/* Glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.desc}</p>

            {/* Special preview for Multiple Views */}
            {feature.preview && (
              <div className="mt-4 flex gap-3">
                <div className="flex-1 rounded-lg bg-muted/40 p-3 border border-border">
                  <div className="text-xs font-medium text-muted-foreground mb-2">Timeline View</div>
                  <div className="space-y-1">
                    <div className="h-2 bg-primary/30 rounded"></div>
                    <div className="h-2 bg-primary/40 rounded w-3/4"></div>
                    <div className="h-2 bg-primary/25 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="flex-1 rounded-lg bg-muted/40 p-3 border border-border">
                  <div className="text-xs font-medium text-muted-foreground mb-2">Chart View</div>
                  <div className="flex items-end gap-1 h-8">
                    <div className="bg-primary/30 rounded-t w-3 h-6"></div>
                    <div className="bg-primary/20 rounded-t w-3 h-4"></div>
                    <div className="bg-primary/50 rounded-t w-3 h-8"></div>
                    <div className="bg-primary/25 rounded-t w-3 h-5"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>

    

  </div>
</section>

    )
}