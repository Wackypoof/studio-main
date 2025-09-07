'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search,
  ShoppingCart,
  Layers,
  FileText,
  Smartphone,
  Briefcase,
  Utensils,
  Home,
  HeartPulse,
  Building2,
  GraduationCap,
  Truck,
  Hotel,
  Leaf,
  Banknote,
  Factory
} from 'lucide-react';

interface Industry {
  label: string;
  icon: React.ReactNode;
}

const industries: Industry[] = [
  { label: 'All', icon: <Search className="h-6 w-6" /> },
  { label: 'E-commerce', icon: <ShoppingCart className="h-6 w-6" /> },
  { label: 'SaaS', icon: <Layers className="h-6 w-6" /> },
  { label: 'Content', icon: <FileText className="h-6 w-6" /> },
  { label: 'Mobile App', icon: <Smartphone className="h-6 w-6" /> },
  { label: 'Service', icon: <Briefcase className="h-6 w-6" /> },
  { label: 'F&B', icon: <Utensils className="h-6 w-6" /> },
  { label: 'Real Estate', icon: <Home className="h-6 w-6" /> },
  { label: 'Healthcare', icon: <HeartPulse className="h-6 w-6" /> },
  { label: 'Construction', icon: <Building2 className="h-6 w-6" /> },
  { label: 'Education', icon: <GraduationCap className="h-6 w-6" /> },
  { label: 'Logistics', icon: <Truck className="h-6 w-6" /> },
  { label: 'Hospitality', icon: <Hotel className="h-6 w-6" /> },
  { label: 'Sustainability', icon: <Leaf className="h-6 w-6" /> },
  { label: 'Finance', icon: <Banknote className="h-6 w-6" /> },
  { label: 'Manufacturing', icon: <Factory className="h-6 w-6" /> },
];

interface DashboardCollectionsProps {
  selectedIndustry: string;
  onSelect: (industry: string) => void;
}

export function DashboardCollections({ selectedIndustry, onSelect }: DashboardCollectionsProps) {
  const handleIndustryClick = (label: string) => {
    onSelect(label === 'All' ? 'all' : label);
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="relative
        before:absolute before:left-0 before:top-0 before:bottom-0 before:w-6 before:bg-gradient-to-r before:from-background before:to-transparent before:z-10
        after:absolute after:right-0 after:top-0 after:bottom-0 after:w-6 after:bg-gradient-to-l after:from-background after:to-transparent after:z-10
      ">
        <div 
          className="flex space-x-4 py-4 px-6 overflow-x-auto no-scrollbar"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {industries.map((industry) => (
            <div 
              key={industry.label}
              onClick={() => handleIndustryClick(industry.label)}
              className={`flex-shrink-0 cursor-pointer transition-all duration-200 ${selectedIndustry === industry.label || (industry.label === 'All' && selectedIndustry === 'all') ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
            >
              <Card className={`h-full transition-all duration-200 ${selectedIndustry === industry.label || (industry.label === 'All' && selectedIndustry === 'all') ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-border'}`}>
                <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                  <div className={`mb-2 transition-colors ${selectedIndustry === industry.label || (industry.label === 'All' && selectedIndustry === 'all') ? 'text-primary' : 'text-foreground/80'}`}>
                    {industry.icon}
                  </div>
                  <span className={`text-sm font-medium ${selectedIndustry === industry.label || (industry.label === 'All' && selectedIndustry === 'all') ? 'text-primary' : 'text-foreground/90'}`}>
                    {industry.label}
                  </span>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
