'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2, Terminal } from 'lucide-react';
import { generateListingSummary } from '@/app/actions';
import type { Listing } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ListingAnalyzerProps {
  listing: Listing;
}

export function ListingAnalyzer({ listing }: ListingAnalyzerProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);
    try {
      const result = await generateListingSummary({
        headline: listing.headline,
        teaser: listing.teaser,
        revenue_t12m: listing.revenue_t12m,
        profit_t12m: listing.profit_t12m,
        asking_price: listing.asking_price,
        assets_summary: listing.assets_summary,
        licences_summary: listing.licences_summary,
        staff_count: listing.staff_count,
        lease_summary: listing.lease_summary,
        vertical: listing.vertical,
        location_area: listing.location_area,
      });
      setSummary(result);
    } catch (e) {
      setError('Failed to generate analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <CardTitle className="flex items-center">
                    <Wand2 className="mr-2 text-accent" />
                    Instant Risk Analysis
                </CardTitle>
                <CardDescription>
                    Run our AI analysis to get an instant summary of risks & opportunities.
                </CardDescription>
            </div>
            <Button onClick={handleAnalyze} disabled={isLoading} className="w-full sm:w-auto flex-shrink-0">
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                    </>
                ) : (
                    'Run Instant Risk Analysis'
                )}
            </Button>
        </div>
      </CardHeader>
      {(isLoading || summary || error) && (
        <CardContent>
            {isLoading && (
                 <div className="flex items-center justify-center p-8 space-x-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Our AI is analyzing the listing... This may take a moment.</span>
                 </div>
            )}
            {error && (
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {summary && (
                <div className="text-sm text-foreground/90 whitespace-pre-wrap font-sans leading-relaxed">
                    {summary}
                </div>
            )}
        </CardContent>
      )}
    </Card>
  );
}
