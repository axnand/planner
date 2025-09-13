'use client'
import CTASection from "@/components/CTASection";
import FeatureSection from "@/components/FeatureSection";
import HeroSection from "@/components/HeroSection";
import HolidayBanner from "@/components/HolidayBanner";
import { useRouter } from "next/navigation";
import Features from "@/components/Features";


export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-6">
        <HolidayBanner onPlanLongWeekend={()=>router.push("weekend-planner")} />
      </div>
    <HeroSection/>
    <FeatureSection/>
    <Features/>
    <CTASection/>
    </div>
  );
}
