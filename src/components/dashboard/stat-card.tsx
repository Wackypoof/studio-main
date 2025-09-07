import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface TrendProps {
  value: string;
  type: 'up' | 'down' | 'neutral';
}

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  trend?: TrendProps;
  onClick?: () => void;
  clickable?: boolean;
}

export function StatCard({ 
  title, 
  value, 
  description, 
  icon,
  className = '',
  trend,
  onClick,
  clickable = false
}: StatCardProps) {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-500 dark:text-gray-400'
  };

  const TrendIcon = trend?.type === 'up' 
    ? ArrowUpRight 
    : trend?.type === 'down' 
      ? ArrowDownRight 
      : Minus;

  const cardContent = (
    <Card 
      className={cn(
        'h-full flex flex-col transition-all', 
        clickable && 'hover:shadow-md hover:border-primary/50 cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="flex items-center justify-between">
          <CardDescription className="text-xs">{description}</CardDescription>
          {trend && (
            <div className={cn(
              'flex items-center text-xs font-medium',
              trendColors[trend.type] || trendColors.neutral
            )}>
              <TrendIcon className="h-3 w-3 mr-1" />
              {trend.value}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (clickable && onClick) {
    return (
      <div className="h-full" role="button" tabIndex={0} onClick={onClick}>
        {cardContent}
      </div>
    );
  }

  return cardContent;
}
