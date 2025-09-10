"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/saved" && pathname !== "/weekend-planner"  && <Navbar />}
      {children}
    </>
  );
}