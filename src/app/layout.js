
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import LayoutWrapper from "@/components/ui/LayoutWrapper";
import { Toaster } from "@/components/ui/sonner"
import ServiceWorkerRegister from "@/context/ServiceWorker";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Weekendly - Plan Your Perfect Weekend",
  description: "Weekendly helps you discover nearby spots, plan weekends or long weekends, and create personalized schedules with smart recommendations, offline access, and shareable plans.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={montserrat.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutWrapper>{children}</LayoutWrapper>
          <ServiceWorkerRegister />
           <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}




