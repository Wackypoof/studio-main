import { redirect } from 'next/navigation';

export default function LegacyListingPageRedirect({ params }: { params: { id: string } }) {
  // This legacy route has been deprecated. Redirect to the new business details page.
  redirect(`/dashboard/listings/${params.id}`);
}
