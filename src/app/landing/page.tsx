'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Search, BarChart3, Users, Zap, ChevronRight } from 'lucide-react';
import { SiteContainer } from '@/components/site-container';
import { Header } from '@/components/Header';
import Link from 'next/link';
import { FeaturedListings } from '@/components/featured-listings';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <SiteContainer>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Premier Marketplace for Online Businesses
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              Connect with buyers and sellers in the most trusted marketplace for online businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-6 text-base font-medium" asChild>
                <Link href="/buyers">I'm a Buyer</Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-base font-medium" asChild>
                <Link href="/sellers">I'm a Seller</Link>
              </Button>
            </div>
          </div>
        </SiteContainer>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <SiteContainer>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform</h2>
            <p className="text-xl text-gray-600">
              We make buying and selling businesses simple, secure, and successful.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="h-8 w-8 text-blue-600" />,
                title: "Find the Perfect Match",
                description: "Discover businesses that match your criteria with our advanced search and filtering options."
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
                title: "Data-Driven Decisions",
                description: "Make informed decisions with detailed business analytics and financial information."
              },
              {
                icon: <Users className="h-8 w-8 text-blue-600" />,
                title: "Trusted Community",
                description: "Join a network of verified buyers and sellers with a proven track record."
              },
              {
                icon: <CheckCircle2 className="h-8 w-8 text-blue-600" />,
                title: "Verified Listings",
                description: "All businesses are vetted to ensure quality and accuracy of information."
              },
              {
                icon: <Zap className="h-8 w-8 text-blue-600" />,
                title: "Quick Transactions",
                description: "Our streamlined process helps you close deals faster and with confidence."
              },
              {
                icon: <CheckCircle2 className="h-8 w-8 text-blue-600" />,
                title: "Dedicated Support",
                description: "Get expert guidance from our team throughout the entire process."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </SiteContainer>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <SiteContainer>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '$10B+', label: 'Total Value Sold' },
              { value: '50K+', label: 'Businesses Listed' },
              { value: '500K+', label: 'Members' },
              { value: '98%', label: 'Success Rate' },
            ].map((stat) => (
              <div key={stat.label} className="p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </SiteContainer>
      </section>

      {/* Featured Listings */}
      <section className="py-20 bg-white">
        <SiteContainer>
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Businesses</h2>
              <p className="text-gray-600 mt-2">Hand-picked businesses with verified financials</p>
            </div>
            <Button variant="ghost" className="text-blue-600 hover:bg-blue-50" asChild>
              <Link href="/browse">
                View all listings <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <FeaturedListings />
          
          <div className="mt-12 text-center">
            <Button size="lg" className="px-8 py-6 text-base font-medium" asChild>
              <Link href="/browse">Browse All Businesses</Link>
            </Button>
          </div>
        </SiteContainer>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <SiteContainer>
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Trusted by Entrepreneurs</h2>
            <p className="text-xl text-gray-600">
              Join thousands of buyers and sellers who have successfully transacted on our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The process was seamless from start to finish. Found the perfect business within a week.",
                author: "Alex T.",
                role: "Acquired SaaS Business"
              },
              {
                quote: "Sold my e-commerce store for 5x annual profit. The team was incredibly helpful throughout.",
                author: "Jamie L.",
                role: "Former Business Owner"
              },
              {
                quote: "As a first-time buyer, I appreciated the transparency and support during the entire process.",
                author: "Morgan K.",
                role: "New Business Owner"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="text-yellow-400 mb-4">
                  {'★'.repeat(5)}
                </div>
                <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                <div className="font-medium">{testimonial.author}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </SiteContainer>
      </section>
      
      {/* Final CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <SiteContainer>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Business Journey Today</h2>
            <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
              Whether you're looking to buy your next business or sell your current one, we're here to help every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                className="px-8 py-6 text-base font-medium"
                asChild
              >
                <Link href="/sign-up">Get Started for Free</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-6 text-base font-medium text-white border-white hover:bg-white/10"
                asChild
              >
                <Link href="/contact">Schedule a Call</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center space-x-2 text-sm text-blue-200">
              <CheckCircle2 className="h-4 w-4" />
              <span>No upfront costs for sellers</span>
              <span className="mx-2">•</span>
              <CheckCircle2 className="h-4 w-4" />
              <span>Free to browse for buyers</span>
            </div>
          </div>
        </SiteContainer>
      </section>
    </div>
  );
}
