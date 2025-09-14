"use client";
import { useEffect } from "react";
import { registerServiceWorker } from "@/utils/pwa";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      registerServiceWorker();
    }
  }, []);

  return null;
}
