// Service Worker Unregister & Cache Cleaner
// Ensures the web app does not cache offline and always loads fresh updates from the live server.
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    // Unregister all existing service workers to ensure live internet updates
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then((success) => {
          if (success) {
            console.log('[PWA] Service worker unregistered successfully');
          }
        });
      }
    });

    // Clear all existing caches
    if ('caches' in window) {
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name);
        }
      });
    }
  }
}
