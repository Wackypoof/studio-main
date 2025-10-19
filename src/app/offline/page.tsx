import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WifiOff, Home } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 text-center">
      <div className="mx-auto w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <WifiOff className="h-10 w-10 text-red-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">You're offline</h1>
        <p className="text-gray-600">
          It looks like you've lost your internet connection. Please check your network and try again.
        </p>
        <div className="pt-4">
          <Link href="/" passHref>
            <Button className="w-full" variant="default">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
