'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle2, Search, BarChart3, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import { SiteContainer } from '@/components/site-container';
import { Header } from '@/components/Header';

export default function BuyersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-16 pb-20 bg-gradient-to-b from-blue-50 to-white">
        <SiteContainer>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Find and Acquire the Perfect Business
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Browse our curated selection of high-quality businesses and start your entrepreneurial journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-6 text-base font-medium" asChild>
                <Link href="/listings">Browse Listings</Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-base font-medium" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </SiteContainer>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <SiteContainer>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Buy With Us</h2>
            <p className="text-xl text-gray-600">
              We make it simple to find and acquire the perfect business opportunity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Search className="h-6 w-6" />,
                title: "Curated Listings",
                description: "Access vetted, high-quality businesses with verified financials and growth potential."
              },
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: "Financial Transparency",
                description: "View detailed revenue, profit margins, and growth metrics for every listing."
              },
              {
                icon: <ShieldCheck className="h-6 w-6" />,
                title: "Secure Transactions",
                description: "Complete transactions with confidence using our secure escrow service and legal support."
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: "Quick Closing",
                description: "Our streamlined process helps you close deals faster with minimal hassle."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </SiteContainer>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <SiteContainer>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Find Your Next Business?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of buyers who have found their perfect business opportunity with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8 py-6 text-base font-medium" asChild>
                <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-6 text-base font-medium text-blue-700 bg-white hover:bg-blue-50" asChild>
                <Link href="/listings">Browse Listings</Link>
              </Button>
            </div>
          </div>
        </SiteContainer>
      </section>
    </div>
  );
}
