import { mockData } from '@/lib/data';
import { AnalyticsClient } from './analytics-client';

// This is a server component that fetches data and passes it to the client component
export default function AnalyticsPage({
  searchParams,
}: {
  searchParams: { listing?: string };
}) {
  // In a real app, this would come from an API call
  const currentUser = mockData.testUsers.seller1; // Default to seller1 for demo
  
  // Get user's listings
  const userListings = mockData.listings.filter(
    (listing) => listing.userId === currentUser.id
  );
  
  // Generate mock data with consistent values
  const viewsData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(2025, 8, i + 1).toISOString().split('T')[0],
    views: Math.floor((i * 3 + 100) % 150) + 50, // Deterministic values
    clicks: Math.floor((i * 2 + 20) % 80) + 10,   // Deterministic values
  }));
  
  const leadsData = [
    { name: 'Contact Form', value: 45 },
    { name: 'WhatsApp', value: 25 },
    { name: 'Phone Calls', value: 15 },
    { name: 'Email', value: 10 },
  ];
  
  // Prepare initial data
  const initialData = {
    viewsData,
    leadsData,
    userListings: userListings.map(({ id, headline, status, revenue_t12m }) => ({
      id,
      headline,
      status,
      revenue: revenue_t12m,
    })),
    currentUser,
  };
  
  return <AnalyticsClient initialData={initialData} searchParams={searchParams} />;
}
