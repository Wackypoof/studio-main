
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, List, LayoutGrid, Eye, Star, Folder, PieChart, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';

const DealStageButton = ({ icon: Icon, label, isActive, onClick, children }: { icon: React.ElementType, label: string, isActive: boolean, onClick: () => void, children?: React.ReactNode }) => (
    <Button
        variant="ghost"
        onClick={onClick}
        className={cn(
            'w-full justify-start text-foreground/80 font-medium',
            isActive ? 'text-primary' : 'hover:text-primary'
        )}
    >
        <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "text-foreground/60")} />
        <span>{label}</span>
        {children}
    </Button>
);

export default function MyDealsPage() {
    const [activeStage, setActiveStage] = useState('Evaluating');

    const stages = {
        'Evaluating': {
            title: 'Evaluating',
            description: "Startups you've requested access to and are evaluating before making an offer.",
            icon: Eye,
        },
        'All': {
            title: 'All Deals',
            description: "All businesses in your pipeline.",
            icon: Folder,
        },
        'Sample': {
            title: 'Sample List',
            description: "A sample list of businesses.",
            icon: PieChart,
        },
    }

    const currentStage = stages[activeStage as keyof typeof stages];

    return (
        <div className="space-y-8">
            <PageHeader 
                title="My Deals"
                description="Track and manage all your business opportunities in one place."
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1">
                    <nav className="space-y-1">
                        <DealStageButton
                            label="Evaluating"
                            icon={Eye}
                            isActive={activeStage === 'Evaluating'}
                            onClick={() => setActiveStage('Evaluating')}
                        />
                        <div className="px-3 pt-4 pb-2 text-sm font-semibold text-foreground/80 flex justify-between items-center">
                            My Favorites
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground/60 hover:text-primary">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                         <DealStageButton
                            label="All"
                            icon={Folder}
                            isActive={activeStage === 'All'}
                            onClick={() => setActiveStage('All')}
                        />
                        <DealStageButton
                            label="Sample list"
                            icon={PieChart}
                            isActive={activeStage === 'Sample'}
                            onClick={() => setActiveStage('Sample')}
                        />
                    </nav>
                </div>
                <div className="col-span-3">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-foreground/90">{currentStage.title}</h2>
                            <p className="text-muted-foreground mt-1">{currentStage.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                                <Search className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                                <List className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <Card className="flex items-center justify-center h-60 bg-muted/50 border-0 shadow-none">
                        <div className="text-center">
                            <h3 className="text-base font-semibold text-foreground/90">Nothing in your pipeline just yet</h3>
                            <p className="text-muted-foreground text-sm mt-1 max-w-sm">When you request access to startups you&apos;re interested in, they&apos;ll appear here.</p>
                             <Button asChild className="mt-4">
                                <Link href="/">
                                    Browse Listings
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
