interface PriceDisplayProps {
  price: number;
  revenue: number;
  profitMargin: number;
}

export function PriceDisplay({ price, revenue, profitMargin }: PriceDisplayProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000) {
      return `\$${(amount / 1_000_000).toFixed(1)}m`;
    }
    if (amount >= 1_000) {
      return `\$${(amount / 1_000).toFixed(0)}k`;
    }
    return `\$${amount}`;
  };

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">Asking Price</p>
        <p className="text-3xl font-bold text-primary">{formatCurrency(price)}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Annual Revenue</p>
          <p className="font-medium">{formatCurrency(revenue)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Profit Margin</p>
          <p className="font-medium">{profitMargin}%</p>
        </div>
      </div>
    </div>
  );
}
