'use client';

import { useEffect, useState } from 'react';
import { Button } from './button';
import { useServiceWorker } from '@/hooks/useServiceWorker';

export function UpdateNotification() {
  const { updateAvailable, updateServiceWorker } = useServiceWorker();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (updateAvailable) {
      setIsVisible(true);
    }
  }, [updateAvailable]);

  const handleUpdate = () => {
    updateServiceWorker();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md p-4 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <svg
            className="w-6 h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="ml-3 w-0 flex-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Update Available
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            A new version of the app is available. Please update to the latest version.
          </p>
          <div className="mt-4 flex space-x-3">
            <Button
              size="sm"
              onClick={handleUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Update Now
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDismiss}
              className="text-gray-700 dark:text-gray-200"
            >
              Dismiss
            </Button>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={handleDismiss}
            className="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
