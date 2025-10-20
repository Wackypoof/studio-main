import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ShieldCheck, MapPin, Clock } from 'lucide-react';
import type { Listing } from '@/lib/types';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000) {
      return `$${(amount / 1_000_000).toFixed(1)}m`;
    }
    if (amount >= 1_000) {
      return `$${(amount / 1_000).toFixed(0)}k`;
    }
    return `$${amount}`;
  };

  return (
    <Link href={`/dashboard/listings/${listing.id}`} className="block h-full group">
      <Card className="flex flex-col overflow-hidden h-full border border-border/50 transition-all hover:border-primary/20 hover:shadow-md">
        <CardHeader className="p-4 relative flex flex-row justify-between items-start">
          <div>
            <Badge variant="secondary">{listing.vertical}</Badge>
          </div>
          <div className="flex items-center gap-2">
            {listing.verified && (
              <Badge variant="outline" className="gap-1 text-xs border-green-500 text-green-700">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </Badge>
            )}
            <Badge variant="outline" className="gap-1 text-xs">
              <Clock className="h-3 w-3" />
              {`Responds in ~${Math.max(1, Math.min(72, Math.round(listing.avg_response_time_hours ?? 24)))}h`}
            </Badge>
            {listing.status === 'under_offer' && (
              <Badge variant="destructive">UNDER OFFER</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-1">
          <h3 className="font-semibold text-lg leading-tight text-foreground/90 group-hover:text-primary transition-colors duration-200">
            {listing.headline}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{listing.teaser}</p>
          <div className="flex items-center text-sm text-muted-foreground mt-3">
            <MapPin className="h-4 w-4 mr-1.5" />
            {listing.location_area}
          </div>
        </CardContent>
        <CardFooter className="p-4 bg-muted/50">
          <div className="grid grid-cols-3 gap-4 w-full text-center">
              <div>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="font-semibold text-sm">{formatCurrency(listing.revenue_t12m)}</p>
              </div>
              <div>
                  <p className="text-xs text-muted-foreground">Profit</p>
                  <p className="font-semibold text-sm">{formatCurrency(listing.profit_t12m)}</p>
              </div>
              <div>
                  <p className="text-xs text-muted-foreground">Asking Price</p>
                  <p className="font-semibold text-sm text-primary">{formatCurrency(listing.asking_price)}</p>
              </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
