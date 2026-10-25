// StitchAI Service Worker Registration Script Template

export interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

export function registerServiceWorker(config?: ServiceWorkerConfig) {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.info('[StitchAI PWA] Service Worker not supported in this browser environment.');
    return;
  }

  window.addEventListener('load', () => {
    const swUrl = '/sw.js';

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('[StitchAI PWA] Service Worker registered successfully with scope:', registration.scope);

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('[StitchAI PWA] New atelier app version available; please refresh.');
                if (config?.onUpdate) config.onUpdate(registration);
              } else {
                console.log('[StitchAI PWA] Offline caching complete. App ready for offline workshop use.');
                if (config?.onSuccess) config.onSuccess(registration);
              }
            }
          };
        };
      })
      .catch((error) => {
        console.warn('[StitchAI PWA] Service Worker registration failed:', error);
        if (config?.onError) config.onError(error);
      });
  });
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => registration.unregister())
      .catch((error) => console.error(error.message));
  }
}
