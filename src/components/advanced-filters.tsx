'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, X, SortDesc } from 'lucide-react';

interface AdvancedFiltersProps {
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  revenueRange: [number, number];
  onRevenueRangeChange: (value: [number, number]) => void;
  profitMarginRange: [number, number];
  onProfitMarginChange: (value: [number, number]) => void;
  selectedLocation: string;
  onLocationChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'revenue_desc' | 'margin_desc';
  onSortChange?: (value: 'newest' | 'price_asc' | 'price_desc' | 'revenue_desc' | 'margin_desc') => void;
}

export function AdvancedFilters({
  priceRange,
  onPriceRangeChange,
  revenueRange,
  onRevenueRangeChange,
  profitMarginRange,
  onProfitMarginChange,
  selectedLocation,
  onLocationChange,
  selectedStatus,
  onStatusChange,
}: AdvancedFiltersProps) {
  const [open, setOpen] = useState(false);
  const DEFAULTS = {
    price: [0, 10000000] as [number, number],
    revenue: [0, 5000000] as [number, number],
    margin: [0, 50] as [number, number],
    location: 'all',
    status: 'all',
    sortBy: 'newest' as const,
  };

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    return `$${(value / 1_000).toFixed(0)}k`;
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  return (
    <div className="flex flex-col gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-2 flex-wrap">
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </DialogTrigger>
          {/* Optional inline sort control */}
          <div className="hidden md:block">
            <Select value={(typeof sortBy !== 'undefined' ? sortBy : DEFAULTS.sortBy)} onValueChange={(v) => onSortChange?.(v as any)}>
              <SelectTrigger className="h-9 w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="revenue_desc">Revenue: High to Low</SelectItem>
                <SelectItem value="margin_desc">Profit Margin: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Active filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {!(priceRange[0] === DEFAULTS.price[0] && priceRange[1] === DEFAULTS.price[1]) && (
            <Badge variant="secondary" className="gap-1">
              Price: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
              <button className="ml-1" onClick={() => onPriceRangeChange(DEFAULTS.price)} aria-label="Clear price filter">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {!(revenueRange[0] === DEFAULTS.revenue[0] && revenueRange[1] === DEFAULTS.revenue[1]) && (
            <Badge variant="secondary" className="gap-1">
              Revenue: {formatCurrency(revenueRange[0])} - {formatCurrency(revenueRange[1])}
              <button className="ml-1" onClick={() => onRevenueRangeChange(DEFAULTS.revenue)} aria-label="Clear revenue filter">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {!(profitMarginRange[0] === DEFAULTS.margin[0] && profitMarginRange[1] === DEFAULTS.margin[1]) && (
            <Badge variant="secondary" className="gap-1">
              Margin: {profitMarginRange[0]}% - {profitMarginRange[1]}%
              <button className="ml-1" onClick={() => onProfitMarginChange(DEFAULTS.margin)} aria-label="Clear margin filter">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedLocation !== DEFAULTS.location && (
            <Badge variant="secondary" className="gap-1">
              Location: {selectedLocation}
              <button className="ml-1" onClick={() => onLocationChange(DEFAULTS.location)} aria-label="Clear location filter">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedStatus !== DEFAULTS.status && (
            <Badge variant="secondary" className="gap-1">
              Status: {selectedStatus}
              <button className="ml-1" onClick={() => onStatusChange(DEFAULTS.status)} aria-label="Clear status filter">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <div className="ml-auto">
            <Button variant="ghost" size="sm" onClick={() => {
              onPriceRangeChange(DEFAULTS.price);
              onRevenueRangeChange(DEFAULTS.revenue);
              onProfitMarginChange(DEFAULTS.margin);
              onLocationChange(DEFAULTS.location);
              onStatusChange(DEFAULTS.status);
              onSortChange?.(DEFAULTS.sortBy);
            }}>Clear all</Button>
          </div>
        </div>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Advanced Filters</DialogTitle>
            <div className="flex items-center gap-2">
              <SortDesc className="h-4 w-4 text-muted-foreground" />
              <Select value={(typeof sortBy !== 'undefined' ? sortBy : DEFAULTS.sortBy)} onValueChange={(v) => onSortChange?.(v as any)}>
                <SelectTrigger className="h-9 w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="revenue_desc">Revenue: High to Low</SelectItem>
                  <SelectItem value="margin_desc">Profit Margin: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Price Range */}
          <div className="space-y-4">
            <h3 className="font-medium">Price Range</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
                    className="w-32 pl-7"
                  />
                </div>
                <span className="mx-2">to</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
                    className="w-32 pl-7"
                  />
                </div>
              </div>
              <Slider
                value={priceRange}
                onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                min={0}
                max={10000000}
                step={10000}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatCurrency(0)}</span>
                <span>{formatCurrency(10000000)}</span>
              </div>
            </div>
          </div>

          {/* Revenue Range */}
          <div className="space-y-4">
            <h3 className="font-medium">Annual Revenue</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    value={revenueRange[0]}
                    onChange={(e) => onRevenueRangeChange([Number(e.target.value), revenueRange[1]])}
                    className="w-32 pl-7"
                  />
                </div>
                <span className="mx-2">to</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    value={revenueRange[1]}
                    onChange={(e) => onRevenueRangeChange([revenueRange[0], Number(e.target.value)])}
                    className="w-32 pl-7"
                  />
                </div>
              </div>
              <Slider
                value={revenueRange}
                onValueChange={(value) => onRevenueRangeChange(value as [number, number])}
                min={0}
                max={5000000}
                step={10000}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatCurrency(0)}</span>
                <span>{formatCurrency(5000000)}</span>
              </div>
            </div>
          </div>

          {/* Profit Margin */}
          <div className="space-y-4">
            <h3 className="font-medium">Profit Margin</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative">
                  <Input
                    type="number"
                    value={profitMarginRange[0]}
                    onChange={(e) => onProfitMarginChange([Number(e.target.value), profitMarginRange[1]])}
                    className="w-32 pr-7"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
                <span className="mx-2">to</span>
                <div className="relative">
                  <Input
                    type="number"
                    value={profitMarginRange[1]}
                    onChange={(e) => onProfitMarginChange([profitMarginRange[0], Number(e.target.value)])}
                    className="w-32 pr-7"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
              </div>
              <Slider
                value={profitMarginRange}
                onValueChange={(value) => onProfitMarginChange(value as [number, number])}
                min={0}
                max={50}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0%</span>
                <span>50%</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="font-medium">Location</h3>
            <Select value={selectedLocation} onValueChange={onLocationChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Singapore">Singapore</SelectItem>
                <SelectItem value="Malaysia">Malaysia</SelectItem>
                <SelectItem value="Indonesia">Indonesia</SelectItem>
                <SelectItem value="Thailand">Thailand</SelectItem>
                <SelectItem value="Vietnam">Vietnam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="font-medium">Status</h3>
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => {
            onPriceRangeChange(DEFAULTS.price);
            onRevenueRangeChange(DEFAULTS.revenue);
            onProfitMarginChange(DEFAULTS.margin);
            onLocationChange(DEFAULTS.location);
            onStatusChange(DEFAULTS.status);
            onSortChange?.(DEFAULTS.sortBy);
          }}>
            Reset Filters
          </Button>
          <Button onClick={() => setOpen(false)}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
      </Dialog>
    </div>
  );
}
