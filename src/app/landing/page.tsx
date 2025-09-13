'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Search, BarChart3, Users, User, Zap, ChevronRight, Shield, BadgeCheck, TrendingUp, Briefcase } from 'lucide-react';
import { SiteContainer } from '@/components/site-container';
import { Header } from '@/components/Header';
import { FeaturedListings } from '@/components/featured-listings';
import { AnimatedStats } from '@/components/animated-stats';
import { ProcessFlow } from '@/components/process-flow';
import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';
import Link from 'next/link';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={fadeInUp}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
    className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-50"
  >
    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>
        
        <SiteContainer className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center"
          >
            {/* Trust Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-white text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-8 shadow-sm border border-blue-100 hover:shadow-md transition-shadow"
            >
              <div className="flex -space-x-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">{i}K+</span>
                  </div>
                ))}
              </div>
              <span>Trusted by 10,000+ entrepreneurs</span>
              <BadgeCheck className="h-4 w-4 text-blue-500" />
            </motion.div>
            
            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              The Smart Way to
              <span className="block mt-2">
                <span className="relative">
                  <span className="relative z-10">Buy & Sell</span>
                  <span className="absolute bottom-0 left-0 w-full h-4 bg-blue-100/60 -z-0 transform -rotate-1"></span>
                </span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Online Businesses</span>
              </span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Join thousands of entrepreneurs who've successfully bought and sold businesses on our platform. 
              Get the best deals with our data-driven approach and expert support.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                size="lg" 
                className="px-8 py-6 text-base font-medium group bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                asChild
              >
                <Link href="/buyers" className="flex items-center">
                  I'm a Buyer
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-6 text-base font-medium group border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-700 transition-all duration-300"
                asChild
              >
                <Link href="/sellers" className="flex items-center">
                  I'm a Seller
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-12 pt-8 border-t border-gray-200"
            >
              <p className="text-sm text-gray-500 mb-4">TRUSTED BY LEADING COMPANIES</p>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
                {['Forbes', 'TechCrunch', 'Bloomberg', 'WSJ'].map((company, i) => (
                  <div key={i} className="text-lg font-medium text-gray-700">{company}</div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </SiteContainer>
      </section>

      {/* Process Flow */}
      <ProcessFlow />

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <SiteContainer>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-5xl mx-auto"
          >
            <motion.div 
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">Trusted by Entrepreneurs Worldwide</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Join thousands of successful transactions on our platform
              </p>
            </motion.div>
            
            <AnimatedStats />
          </motion.div>
        </SiteContainer>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <SiteContainer>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-5xl mx-auto"
          >
            <motion.div 
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <span className="inline-block bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                Why Choose Us
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our platform is designed to make buying and selling businesses simple, secure, and successful.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Search className="h-6 w-6" />}
                title="Advanced Search"
                description="Find the perfect business with our powerful search and filtering tools."
                delay={0}
              />
              <FeatureCard 
                icon={<BarChart3 className="h-6 w-6" />}
                title="Data & Analytics"
                description="Access detailed financials and performance metrics for every listing."
                delay={1}
              />
              <FeatureCard 
                icon={<Shield className="h-6 w-6" />}
                title="Secure Transactions"
                description="Buy and sell with confidence using our secure escrow service."
                delay={2}
              />
              <FeatureCard 
                icon={<Users className="h-6 w-6" />}
                title="Expert Support"
                description="Get guidance from our team of business transfer specialists."
                delay={3}
              />
              <FeatureCard 
                icon={<Zap className="h-6 w-6" />}
                title="Quick Close"
                description="Streamlined process to help you close deals faster."
                delay={4}
              />
              <FeatureCard 
                icon={<BadgeCheck className="h-6 w-6" />}
                title="Verified Listings"
                description="Every business is vetted for accuracy and legitimacy."
                delay={5}
              />
            </div>
          </motion.div>
        </SiteContainer>
      </section>

      {/* Pricing Comparison Section */}
      <section className="py-20 bg-gray-50">
        <SiteContainer>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 hover:border-blue-300 transition-all duration-300 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Briefcase className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">For Buyers</h3>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Free</span>
                <span className="text-gray-500"> to start</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Browse all listings for free</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Save and compare businesses</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Basic search and filters</span>
                </li>
              </ul>
              <div className="mt-auto">
                <Button className="w-full" asChild>
                  <Link href="/buyers/pricing">View Buyer Pricing</Link>
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 hover:border-blue-300 transition-all duration-300 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">For Sellers</h3>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">5% - 8%</span>
                <span className="text-gray-500"> success fee</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Pay only when you sell</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Professional business valuation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Dedicated broker support</span>
                </li>
              </ul>
              <div className="mt-auto">
                <Button className="w-full" asChild>
                  <Link href="/sellers/pricing">View Seller Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>Need help deciding? <Link href="/contact" className="text-blue-600 hover:underline">Contact our team</Link> for personalized advice.</p>
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
