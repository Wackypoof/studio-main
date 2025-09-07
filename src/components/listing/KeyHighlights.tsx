import { Users, Calendar, Clock, Globe } from 'lucide-react';
import type { Listing } from '@/lib/types';

interface KeyHighlightsProps {
  listing: Pick<Listing, 'teamSize' | 'established' | 'hoursPerWeek' | 'market'>;
  className?: string;
}

export function KeyHighlights({ listing, className = '' }: KeyHighlightsProps) {
  return (
    <div className={className}>
      <h3 className="font-semibold mb-3">Key Highlights</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-medium">Team</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {listing.teamSize} full-time employee{listing.teamSize !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-medium">Established</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date(listing.established).getFullYear()}
          </p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-medium">Hours/Week</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {listing.hoursPerWeek} hours to manage
          </p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-primary" />
            <span className="font-medium">Market</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {listing.market}
          </p>
        </div>
      </div>
    </div>
  );
}

interface AcquisitionDetailsProps {
  listing: Pick<Listing, 'sellingReason' | 'assets_summary' | 'licences_summary'>;
  className?: string;
}

export function AcquisitionDetails({ listing, className = '' }: AcquisitionDetailsProps) {
  return (
    <div className={className}>
      <h3 className="font-semibold mb-3">Acquisition Details</h3>
      <div className="p-4 border rounded-lg space-y-4">
        <div>
          <h4 className="font-medium mb-2">Selling Reason</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'starting_new_venture', label: 'Starting a new venture' },
              { value: 'lack_of_time', label: 'Lack of time' },
              { value: 'financing', label: 'Financing' }
            ].map(reason => (
              <div 
                key={reason.value}
                className={`px-3 py-1 rounded-full text-sm ${
                  listing.sellingReason === reason.value 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                {reason.label}
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Financing</h4>
          <div className="flex flex-wrap gap-2">
            <div 
              className={`px-3 py-1 rounded-full text-sm ${
                listing.sellingReason === 'bootstrapped' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}
            >
              Bootstrapped
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Assets Included</h4>
          <p className="text-muted-foreground text-sm">{listing.assets_summary}</p>
        </div>
        
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Licenses & Certifications</h4>
          <p className="text-muted-foreground text-sm">{listing.licences_summary}</p>
        </div>
      </div>
    </div>
  );
}
