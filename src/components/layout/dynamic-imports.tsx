import type { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Dashboard components
export const Dashboard = dynamic(
  () => import('@/app/dashboard/page').then((mod) => mod.default),
  { 
    loading: () => <Skeleton className="h-[calc(100vh-4rem)] w-full" />,
    ssr: false 
  }
);

// Auth components
export const Login = dynamic(
  () => import('@/app/login/page').then((mod) => mod.default),
  { ssr: false }
);

export const SignUp = dynamic(
  () => import('@/app/sign-up/page').then((mod) => mod.default),
  { ssr: false }
);

export const ListingDetail = dynamic<ComponentType<any>>(
  () =>
    import('@/app/listings/[id]/page').then(
      (mod) => mod.default as unknown as ComponentType<any>
    ),
  { 
    loading: () => <Skeleton className="h-[80vh] w-full" />,
    ssr: true 
  }
);

// Add more dynamic imports for other routes as needed
