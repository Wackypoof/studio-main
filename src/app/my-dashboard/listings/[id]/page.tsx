import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, DollarSign, BarChart, TrendingUp, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { listings } from '@/lib/data';
import Link from 'next/link';

export default function ListingDetailsPage({ params }: { params: { id: string } }) {
  const listing = listings.find(l => l.id === params.id);

  if (!listing) {
    notFound();
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000) {
      return `$${(amount / 1_000_000).toFixed(1)}m`;
    }
    if (amount >= 1_000) {
      return `$${(amount / 1_000).toFixed(0)}k`;
    }
    return `$${amount}`;
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/my-dashboard/browse-listings">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Listing Details</h1>
      </div>

      <Card className="border border-border/50">
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-start">
            <div>
              <Badge variant="secondary" className="mb-2">{listing.vertical}</Badge>
              {listing.verified && (
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                  Verified
                </div>
              )}
              {listing.status === 'under_offer' && (
                <Badge variant="destructive" className="mt-2">UNDER OFFER</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <h2 className="font-semibold text-xl leading-tight text-foreground/90">
            {listing.headline}
          </h2>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <MapPin className="h-4 w-4 mr-1.5" />
            {listing.location_area}
          </div>
          
          <p className="mt-4 text-muted-foreground">{listing.teaser}</p>
          
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">Revenue (12m)</p>
              <p className="font-semibold text-sm">{formatCurrency(listing.revenue_t12m)}</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">Profit (12m)</p>
              <p className="font-semibold text-sm">{formatCurrency(listing.profit_t12m)}</p>
            </div>
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-xs text-primary">Asking Price</p>
              <p className="font-semibold text-sm text-primary">{formatCurrency(listing.asking_price)}</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 bg-muted/30 border-t flex justify-between items-center">
          <Button variant="outline" size="sm">
            <MapPin className="h-4 w-4 mr-2" />
            View Location
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Save</Button>
            <Button size="sm" disabled={listing.status === 'under_offer'}>
              {listing.status === 'under_offer' ? 'Under Offer' : 'Make an Offer'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
