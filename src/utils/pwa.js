export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered successfully:", registration);

      
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
             
              console.log("New app version available!");
             
            }
          });
        }
      });

      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }
};

export const unregisterServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        console.log("Service Worker unregistered");
      }
    } catch (error) {
      console.error("Service Worker unregistration failed:", error);
    }
  }
};

export const checkOnlineStatus = () => {
  return navigator.onLine;
};

export const addOnlineListener = (callback) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
};

export const canInstallPWA = () => {

  return "BeforeInstallPromptEvent" in window;
};

export const requestPersistentStorage = async () => {
  if ("storage" in navigator && "persist" in navigator.storage) {
    try {
      const isPersistent = await navigator.storage.persist();
      console.log("Persistent storage:", isPersistent ? "granted" : "denied");
      return isPersistent;
    } catch (error) {
      console.error("Persistent storage request failed:", error);
      return false;
    }
  }
  return false;
};
