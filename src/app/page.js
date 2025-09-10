import CTASection from "@/components/CTASection";
import FeatureSection from "@/components/FeatureSection";
import HeroSection from "@/components/HeroSection";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

import Link from 'next/link';
import Image from "next/image";


export default function Home() {
  return (
    <>
    <HeroSection/>
    <FeatureSection/>
    <CTASection/>
    </>
  );
}
