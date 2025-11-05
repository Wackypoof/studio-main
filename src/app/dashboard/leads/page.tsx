import { LeadsClient } from './leads-client';

export default function LeadsPage({
  searchParams,
}: {
  searchParams: { listing?: string };
}) {
  return <LeadsClient searchParams={searchParams} />;
}
