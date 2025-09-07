import { Users, Calendar, Clock, Globe } from 'lucide-react';
import type { Listing } from '@/lib/types';
import { memo } from 'react';
import { cn } from '@/lib/utils';

// Types for selling reasons
const SELLING_REASONS = [
  { value: 'starting_new_venture' as const, label: 'Starting a new venture' },
  { value: 'lack_of_time' as const, label: 'Lack of time' },
  { value: 'financing' as const, label: 'Financing' },
] as const;

type SellingReason = typeof SELLING_REASONS[number]['value'];

interface KeyHighlightItemProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}

// Memoized highlight item component to prevent unnecessary re-renders
const KeyHighlightItem = memo<KeyHighlightItemProps>(({ 
  icon, 
  title, 
  children, 
  className = '' 
}) => (
  <div className={cn('p-4 border rounded-lg', className)}>
    <div className="flex items-center gap-2 mb-2">
      <span className="text-primary" aria-hidden>
        {icon}
      </span>
      <h4 className="font-medium text-sm">{title}</h4>
    </div>
    <p className="text-sm text-muted-foreground">
      {children}
    </p>
  </div>
));

KeyHighlightItem.displayName = 'KeyHighlightItem';

interface KeyHighlightsProps {
  listing: Pick<Listing, 'teamSize' | 'established' | 'hoursPerWeek' | 'market'>;
  className?: string;
}

export function KeyHighlights({ listing, className = '' }: KeyHighlightsProps) {
  const { teamSize, established, hoursPerWeek, market } = listing;
  const establishedYear = new Date(established).getFullYear();

  return (
    <section className={className} aria-labelledby="key-highlights-heading">
      <h3 id="key-highlights-heading" className="font-semibold mb-3">
        Key Highlights
      </h3>
      <div className="grid md:grid-cols-2 gap-4" role="list">
        <KeyHighlightItem 
          icon={<Users className="h-4 w-4" />} 
          title="Team"
        >
          {teamSize} full-time employee{teamSize !== 1 ? 's' : ''}
        </KeyHighlightItem>
        
        <KeyHighlightItem 
          icon={<Calendar className="h-4 w-4" />} 
          title="Established"
        >
          {establishedYear}
        </KeyHighlightItem>
        
        <KeyHighlightItem 
          icon={<Clock className="h-4 w-4" />} 
          title="Hours/Week"
        >
          {hoursPerWeek} hours to manage
        </KeyHighlightItem>
        
        <KeyHighlightItem 
          icon={<Globe className="h-4 w-4" />} 
          title="Market"
        >
          {market}
        </KeyHighlightItem>
      </div>
    </section>
  );
}

// Status badge component with proper ARIA attributes
const StatusBadge = memo<{ 
  isActive: boolean; 
  children: React.ReactNode;
  className?: string;
}>(({ isActive, children, className = '' }) => (
  <span
    className={cn(
      'px-3 py-1 rounded-full text-sm transition-colors',
      isActive 
        ? 'bg-primary text-primary-foreground' 
        : 'bg-muted text-muted-foreground',
      className
    )}
    aria-current={isActive ? 'true' : undefined}
  >
    {children}
  </span>
));

StatusBadge.displayName = 'StatusBadge';

// Extend the Listing type to include the financing property
interface ListingWithFinancing extends Omit<Listing, 'financing'> {
  financing?: 'bootstrapped' | 'vc_backed' | 'angel_invested';
}

interface AcquisitionDetailsProps {
  listing: Pick<ListingWithFinancing, 'sellingReason' | 'assets_summary' | 'licences_summary' | 'financing'>;
  className?: string;
}

export function AcquisitionDetails({ 
  listing, 
  className = '' 
}: AcquisitionDetailsProps) {
  const { sellingReason, financing, assets_summary, licences_summary } = listing;

  return (
    <section className={className} aria-labelledby="acquisition-details-heading">
      <h3 id="acquisition-details-heading" className="font-semibold mb-3">
        Acquisition Details
      </h3>
      <div className="p-4 border rounded-lg space-y-4">
        <div>
          <h4 className="font-medium mb-2">Selling Reason</h4>
          <div className="flex flex-wrap gap-2" role="list">
            {SELLING_REASONS.map((reason) => (
              <StatusBadge 
                key={reason.value}
                isActive={sellingReason === reason.value}
              >
                {reason.label}
              </StatusBadge>
            ))}
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Financing</h4>
          <div className="flex flex-wrap gap-2" role="list">
            <StatusBadge isActive={financing === 'bootstrapped'}>
              Bootstrapped
            </StatusBadge>
          </div>
        </div>
        
        {assets_summary && (
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Assets Included</h4>
            <p className="text-muted-foreground text-sm">{assets_summary}</p>
          </div>
        )}
        
        {licences_summary && (
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Licenses</h4>
            <p className="text-muted-foreground text-sm">{licences_summary}</p>
          </div>
        )}
      </div>
    </section>
  );
}
