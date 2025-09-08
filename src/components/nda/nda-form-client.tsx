'use client';

import dynamic from 'next/dynamic';

// Dynamically import the NDA form with SSR disabled
const NdaForm = dynamic<{}>(
  () => import('../nda-form').then((mod) => mod.NdaForm),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-pulse">Loading NDA form...</div>
      </div>
    )
  }
);

export function NdaFormClient() {
  return <NdaForm />;
}
