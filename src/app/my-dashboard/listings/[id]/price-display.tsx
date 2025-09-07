interface PriceDisplayProps {
  price: number;
}

export function PriceDisplay({ price }: PriceDisplayProps) {
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
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
      <div>
        <p className="text-sm text-muted-foreground">Asking Price</p>
        <p className="text-3xl font-bold text-primary">{formatCurrency(price)}</p>
      </div>
    </div>
  );
}
