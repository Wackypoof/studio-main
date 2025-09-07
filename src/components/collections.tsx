
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

interface IndustryCardProps {
  industry: Industry;
  isSelected: boolean;
  onToggle: (label: string) => void;
}

const IndustryCard = React.memo(({ industry, isSelected, onToggle }: IndustryCardProps) => {
  const handleClick = React.useCallback(() => {
    onToggle(industry.label);
  }, [industry.label, onToggle]);

  const cardClasses = [
    'w-full h-full flex flex-col transition-all duration-200 cursor-pointer',
    'focus:outline-none focus:ring-2 focus:ring-primary/20',
    isSelected ? 'bg-primary/5 border-primary' : 'bg-card border border-border/50 hover:border-border',
    'hover:shadow-md rounded-xl',
  ].join(' ');

  const iconClasses = isSelected ? 'text-primary' : 'text-foreground/80';
  const labelClasses = `text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground/90'}`;

  return (
    <div className="w-[200px] h-[120px] flex-shrink-0">
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        className={cardClasses}
        aria-pressed={isSelected}
        aria-label={`${industry.label} category`}
      >
        <CardContent className="flex flex-col items-center justify-center h-full p-4 gap-2">
          <div className={iconClasses} aria-hidden="true">
            {industry.icon}
          </div>
          <span className={labelClasses}>
            {industry.label}
          </span>
        </CardContent>
      </div>
    </div>
  );
});

IndustryCard.displayName = 'IndustryCard';

interface CollectionsProps {
  selectedIndustries: string[];
  onIndustryToggle: (label: string) => void;
}

export function Collections({ selectedIndustries, onIndustryToggle }: CollectionsProps) {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!carouselRef.current) return;
    
    const scrollAmount = 300; // Adjust based on your card width
    
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="w-full py-8 md:py-12 bg-muted/20 border-t border-b"
      aria-label="Industry categories"
    >
      <SiteContainer>
        <div className="flex items-center justify-between mb-6 px-4">
          <h2 className="text-2xl font-bold tracking-tight">Browse by Industry</h2>
        </div>
        
        <div 
          className="relative w-full px-2 md:px-4"
          onKeyDown={handleKeyDown}
        >
          <div className="relative">
            <Carousel
              opts={{
                align: 'start',
                dragFree: true,
                containScroll: 'trimSnaps',
                skipSnaps: true,
              }}
              className="w-full py-2"
            >
              <div 
                ref={carouselRef}
                className="relative overflow-x-auto touch-pan-x snap-x snap-mandatory no-scrollbar px-12"
                role="region"
                aria-label="Industry carousel"
                tabIndex={0}
              >
                <style jsx global>{`
                  .no-scrollbar::-webkit-scrollbar {
                    display: none;
                  }
                  .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                  }
                `}</style>
                <CarouselContent className="py-2">
                  {industries.map((industry) => (
                    <CarouselItem 
                      key={industry.label} 
                      className="px-2 basis-auto snap-start"
                    >
                      <IndustryCard 
                        industry={industry} 
                        isSelected={selectedIndustries.includes(industry.label)}
                        onToggle={onIndustryToggle}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex items-center justify-between absolute w-full top-1/2 -translate-y-1/2 left-0 right-0 z-10 px-2 pointer-events-none">
                <CarouselPrevious 
                  className="relative left-0 bg-background/80 backdrop-blur-sm hover:bg-background shadow-md z-20 pointer-events-auto"
                  aria-label="Previous industries"
                />
                <CarouselNext 
                  className="relative right-0 bg-background/80 backdrop-blur-sm hover:bg-background shadow-md z-20 pointer-events-auto"
                  aria-label="Next industries"
                />
              </div>
            </Carousel>
          </div>
          
          {/* Scroll indicators for mobile */}
          <div className="md:hidden flex justify-center gap-2 mt-4">
            {industries.map((_, index) => (
              <span 
                key={index}
                className="w-2 h-2 rounded-full bg-border"
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
