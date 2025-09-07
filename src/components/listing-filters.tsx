
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface ListingFiltersProps {
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  selectedVertical: string;
  onVerticalChange: (value: string) => void;
  selectedLocation: string;
  onLocationChange: (value: string) => void;
}

export function ListingFilters({
  priceRange,
  onPriceRangeChange,
  selectedVertical,
  onVerticalChange,
  selectedLocation,
  onLocationChange,
}: ListingFiltersProps) {

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    return `$${(value / 1_000).toFixed(0)}k`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Listings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="vertical">Industry Vertical</Label>
          <Select value={selectedVertical} onValueChange={onVerticalChange}>
            <SelectTrigger id="vertical">
              <SelectValue placeholder="All Verticals" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Verticals</SelectItem>
              <SelectItem value="Clinic">Clinic</SelectItem>
              <SelectItem value="Tuition">Tuition</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="F&B">F&B</SelectItem>
              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
              <SelectItem value="Legal">Legal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select value={selectedLocation} onValueChange={onLocationChange}>
            <SelectTrigger id="location">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Central">Central</SelectItem>
              <SelectItem value="East">East</SelectItem>
              <SelectItem value="West">West</SelectItem>
              <SelectItem value="North">North</SelectItem>
              <SelectItem value="Islandwide">Islandwide</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          <Label>Asking Price</Label>
           <Slider
            value={priceRange}
            onValueChange={(value) => onPriceRangeChange(value as [number, number])}
            max={10000000}
            step={100000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatCurrency(priceRange[0])}</span>
            <span>{formatCurrency(priceRange[1])}{priceRange[1] === 10000000 ? '+' : ''}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
