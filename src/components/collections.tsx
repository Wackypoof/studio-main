
'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Stethoscope, School, Store, UtensilsCrossed, Factory, Landmark } from 'lucide-react';
import { SiteContainer } from './site-container';

interface Industry {
  label: string;
  icon: React.ReactNode;
}

const industries: Industry[] = [
    {
        label: 'Clinic',
        icon: <Stethoscope className="h-8 w-8" />,
    },
    {
        label: 'Tuition',
        icon: <School className="h-8 w-8" />,
    },
    {
        label: 'Retail',
        icon: <Store className="h-8 w-8" />,
    },
    {
        label: 'F&B',
        icon: <UtensilsCrossed className="h-8 w-8" />,
    },
    {
        label: 'Manufacturing',
        icon: <Factory className="h-8 w-8" />,
    },
     {
        label: 'Legal',
        icon: <Landmark className="h-8 w-8" />,
    },
];

function IndustryCard({ industry, isSelected, onToggle }: { industry: Industry, isSelected: boolean, onToggle: (label: string) => void }) {
  return (
    <Card
      onClick={() => onToggle(industry.label)}
      className={`w-[220px] h-[120px] flex-shrink-0 cursor-pointer transition-all duration-200 group hover:shadow-lg hover:border-accent
        ${isSelected ? 'bg-primary/10 border-primary' : 'bg-card border-border'}`}
    >
      <CardContent className="flex flex-col items-center justify-center h-full text-center p-4 gap-2">
        <div className={`transition-colors duration-200 ${isSelected ? 'text-primary' : 'text-foreground/80 group-hover:text-primary'}`}>
            {industry.icon}
        </div>
        <p className={`text-sm font-medium transition-colors duration-200 ${isSelected ? 'text-primary' : 'text-foreground/90 group-hover:text-primary'}`}>
          {industry.label}
        </p>
      </CardContent>
    </Card>
  );
}

interface CollectionsProps {
  selectedIndustries: string[];
  onIndustryToggle: (label: string) => void;
}

export function Collections({ selectedIndustries, onIndustryToggle }: CollectionsProps) {
  return (
    <section className="w-full py-8 md:py-12 bg-muted/20 border-t border-b">
      <SiteContainer>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Browse by Industry</h2>
        </div>
        <Carousel
          opts={{
            align: 'start',
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {industries.map((industry) => (
              <CarouselItem key={industry.label} className="pl-4 basis-auto">
                <IndustryCard 
                  industry={industry} 
                  isSelected={selectedIndustries.includes(industry.label)}
                  onToggle={onIndustryToggle}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className='hidden md:block'>
            <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2" />
          </div>
        </Carousel>
      </SiteContainer>
    </section>
  );
}
