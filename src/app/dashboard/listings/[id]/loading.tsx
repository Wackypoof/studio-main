'use client';

export default function ListingDetailsLoading() {
  return (
    <div className="w-full py-6 md:py-8 animate-pulse">
      <div className="h-8 w-48 bg-muted/50 rounded mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="h-48 bg-muted/40 rounded" />
          <div className="h-80 bg-muted/40 rounded" />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="h-40 bg-muted/30 rounded" />
          <div className="h-40 bg-muted/30 rounded" />
        </div>
      </div>
    </div>
  );
}

