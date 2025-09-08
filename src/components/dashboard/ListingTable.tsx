import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowUpRight, Clock, CheckCircle2, PauseCircle } from "lucide-react";
import Link from "next/link";

export const statusVariantMap = {
  draft: "outline",
  pending: "secondary",
  live: "default",
  paused: "secondary",
  under_offer: "default",
  closed: "outline",
} as const;

export const statusIconMap = {
  draft: <Clock className="h-4 w-4" />,
  pending: <Clock className="h-4 w-4" />,
  live: <CheckCircle2 className="h-4 w-4" />,
  paused: <PauseCircle className="h-4 w-4" />,
  "under_offer": <Clock className="h-4 w-4" />,
  closed: <Clock className="h-4 w-4" />,
} as const;

interface ListingTableProps {
  listings: any[];
  onViewListing: (id: string) => void;
  isLoading?: boolean;
}

export function ListingTable({
  listings = [],
  onViewListing,
  isLoading = false,
}: ListingTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
        <h3 className="text-lg font-medium">No listings yet</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Get started by creating your first listing
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="flex flex-col rounded-lg border p-4 transition-colors hover:bg-accent/50 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium">{listing.headline}</h3>
              <Badge
                variant={statusVariantMap[listing.status]}
                className="flex items-center gap-1"
              >
                {statusIconMap[listing.status]}
                {listing.status.replace(/_/g, " ")}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {listing.vertical} • {listing.location_area}
            </p>
            <p className="text-sm">
              <span className="font-medium">
                {formatCurrency(listing.asking_price)}
              </span>{" "}
              <span className="text-muted-foreground">•</span>{" "}
              <span className="text-muted-foreground">
                Updated {formatDate(listing.updatedAt || listing.createdAt, {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </p>
          </div>
          <div className="mt-4 flex items-center space-x-2 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewListing(listing.id)}
              className="w-full sm:w-auto"
            >
              View Details
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/listings/${listing.id}`}>
                <ArrowUpRight className="h-4 w-4" />
                <span className="sr-only">Open in new tab</span>
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
