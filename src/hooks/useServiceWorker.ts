'use client';

import { useEffect, useState } from 'react';

type ServiceWorkerStatus = 'installing' | 'installed' | 'updated' | 'error' | null;

export function useServiceWorker() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [status, setStatus] = useState<ServiceWorkerStatus>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported in this browser');
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        setRegistration(registration);
        
        // Check for updates immediately
        await registration.update();
        
        // Listen for the "controllerchange" event
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });

        // Check for updates every hour
        const updateInterval = setInterval(() => {
          registration.update().catch(console.error);
        }, 60 * 60 * 1000);

        // Clean up interval on unmount
        return () => clearInterval(updateInterval);
      } catch (error) {
        console.error('Service worker registration failed:', error);
        setStatus('error');
      }
    };

    // Listen for the "load" event to avoid delaying the initial page load
    window.addEventListener('load', registerServiceWorker);

    // Listen for the "updatefound" event to track installation progress
    if (registration) {
      const { installing, waiting } = registration;
      
      if (installing) {
        setStatus('installing');
        installing.onstatechange = () => {
          if (installing.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              setStatus('updated');
              setUpdateAvailable(true);
            } else {
              setStatus('installed');
            }
          }
        };
      } else if (waiting) {
        setStatus('updated');
        setUpdateAvailable(true);
      }
    }

    // Clean up event listeners
    return () => {
      window.removeEventListener('load', registerServiceWorker);
    };
  }, [registration]);

  // Function to update the service worker
  const updateServiceWorker = () => {
    if (registration && registration.waiting) {
      // Send a message to the waiting service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setUpdateAvailable(false);
    }
  };

  return { status, updateAvailable, updateServiceWorker };
}
