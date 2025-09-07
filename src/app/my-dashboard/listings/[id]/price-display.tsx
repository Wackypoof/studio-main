import { DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PriceDisplayProps {
  price: number;
  revenue: number;
  profitMargin: number;
}

export function PriceDisplay({ price, revenue, profitMargin }: PriceDisplayProps) {
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
    <div className="flex flex-wrap items-center gap-4">
      <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 min-w-[180px]">
        <p className="text-xs text-muted-foreground">Asking Price</p>
        <p className="text-2xl font-bold text-primary">{formatCurrency(price)}</p>
      </div>
      
      <Badge variant="secondary" className="flex items-center gap-1 h-10">
        <DollarSign className="h-3.5 w-3.5" />
        <span className="font-medium">{revenue > 0 ? `${formatCurrency(revenue)}/year` : 'Revenue not disclosed'}</span>
      </Badge>
      
      <Badge variant="secondary" className="flex items-center gap-1 h-10">
        <span className="h-3.5 w-3.5 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20V10"></path>
            <path d="M18 20V4"></path>
            <path d="M6 20v-4"></path>
          </svg>
        </span>
        <span className="font-medium">{profitMargin}% Margin</span>
      </Badge>
    </div>
  );
}
