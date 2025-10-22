'use client';

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8 w-full p-6 animate-pulse">
      <div className="h-9 w-2/5 rounded bg-muted/50" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded bg-muted/40" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-8 h-60 rounded bg-muted/30" />
        <div className="xl:col-span-4 h-60 rounded bg-muted/30" />
      </div>
    </div>
  );
}

