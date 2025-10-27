'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type ServiceWorkerStatus = 'installing' | 'installed' | 'updated' | 'error' | null;

const UPDATE_INTERVAL_MS = 60 * 60 * 1000;

export function useServiceWorker() {
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const updateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const detachRegistrationListenersRef = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState<ServiceWorkerStatus>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const shouldRegister =
      process.env.NEXT_PUBLIC_ENABLE_SERVICE_WORKER?.toString() === 'true';
    const swPath = process.env.NEXT_PUBLIC_SERVICE_WORKER_PATH || '/service-worker.js';

    if (!shouldRegister) {
      return;
    }

    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported in this browser');
      return;
    }

    const handleControllerChange = () => {
      window.location.reload();
    };

    const attachRegistrationListeners = (
      registration: ServiceWorkerRegistration
    ) => {
      const cleanupFns: Array<() => void> = [];

      const handleInstallingStateChange = (installing: ServiceWorker) => () => {
        if (installing.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            setStatus('updated');
            setUpdateAvailable(true);
          } else {
            setStatus('installed');
          }
        }
      };

      const handleUpdateFound = () => {
        const installing = registration.installing;
        if (!installing) {
          if (registration.waiting) {
            setStatus('updated');
            setUpdateAvailable(true);
          }
          return;
        }

        setStatus('installing');

        const stateChangeListener = handleInstallingStateChange(installing);
        installing.addEventListener('statechange', stateChangeListener);
        cleanupFns.push(() =>
          installing.removeEventListener('statechange', stateChangeListener)
        );
      };

      registration.addEventListener('updatefound', handleUpdateFound);
      cleanupFns.push(() =>
        registration.removeEventListener('updatefound', handleUpdateFound)
      );

      handleUpdateFound();

      return () => {
        cleanupFns.forEach((fn) => fn());
      };
    };

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register(swPath);
        registrationRef.current = registration;

        detachRegistrationListenersRef.current?.();
        detachRegistrationListenersRef.current =
          attachRegistrationListeners(registration);

        await registration.update().catch(() => undefined);

        updateIntervalRef.current = setInterval(() => {
          registration.update().catch((error) => {
            console.error('Service worker update failed:', error);
          });
        }, UPDATE_INTERVAL_MS);
      } catch (error) {
        console.error('Service worker registration failed:', error);
        setStatus('error');
      }
    };

    window.addEventListener('load', registerServiceWorker);
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    if (document.readyState === 'complete') {
      void registerServiceWorker();
    }

    return () => {
      window.removeEventListener('load', registerServiceWorker);
      navigator.serviceWorker.removeEventListener(
        'controllerchange',
        handleControllerChange
      );

      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }

      detachRegistrationListenersRef.current?.();
      detachRegistrationListenersRef.current = null;
    };
  }, []);

  const updateServiceWorker = useCallback(() => {
    const registration = registrationRef.current;
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setUpdateAvailable(false);
    }
  }, []);

  return { status, updateAvailable, updateServiceWorker };
}
