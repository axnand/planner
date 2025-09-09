// src/components/Providers.jsx
"use client";

import { ScheduleProvider } from "@/context/ScheduleContext";
import ThemeWrapper from "./ThemeWrapper.jsx";

export default function Providers({ children }) {
  return (
    <ScheduleProvider>
      <ThemeWrapper>{children}</ThemeWrapper>
    </ScheduleProvider>
  );
}