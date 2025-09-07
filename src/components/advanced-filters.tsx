'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, X } from 'lucide-react';

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Advanced Filters</DialogTitle>
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
            onPriceRangeChange([0, 10000000]);
            onRevenueRangeChange([0, 5000000]);
            onProfitMarginChange([0, 50]);
            onLocationChange('all');
            onStatusChange('all');
          }}>
            Reset Filters
          </Button>
          <Button onClick={() => setOpen(false)}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
