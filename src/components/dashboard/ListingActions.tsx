"use client";

import { Button } from "@/components/ui/button";
import { RoleAwareButton } from "@/components/dashboard/RoleAwareButton";
import { Plus, RefreshCw } from "lucide-react";

interface ListingActionsProps {
  onCreateNewListing: () => void;
  onRefresh?: (() => void) | null;
  isRefreshing?: boolean;
  className?: string;
}

export function ListingActions({
  onCreateNewListing,
  onRefresh,
  isRefreshing = false,
  className = "",
}: ListingActionsProps) {
  return (
    <div className={className}>
      {onRefresh && (
        <Button shape="pill"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Refresh dashboard"
          className="mr-2 rounded-full border-slate-200 px-4 py-2 text-sm font-medium"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      )}
      <RoleAwareButton
        size="sm"
        onClick={onCreateNewListing}
        className="rounded-full px-5 py-2 text-sm font-semibold shadow-md"
      >
        <Plus className="mr-2 h-4 w-4" />
        New Listing
      </RoleAwareButton>
    </div>
  );
}
