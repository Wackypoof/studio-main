'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Search, BarChart3, Users, User, Zap, ChevronRight, Shield, BadgeCheck, TrendingUp, Briefcase } from 'lucide-react';
import { SiteContainer } from '@/components/site-container';
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
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Everything You Need to Succeed
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Our platform is designed to make buying and selling businesses simple, secure, and successful.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Search className="h-6 w-6" />}
              title="Advanced Search"
              description="Find the perfect business with our powerful search and filtering tools."
              delay={0}
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Data-Driven Insights"
              description="Make informed decisions with comprehensive business analytics."
              delay={1}
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Secure Transactions"
              description="Your security is our top priority with escrow and legal protection."
              delay={2}
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Dedicated Support"
              description="Our team of experts is here to guide you through every step."
              delay={3}
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Growth Tools"
              description="Access resources to help your business grow after acquisition."
              delay={4}
            />
            <FeatureCard
              icon={<Briefcase className="h-6 w-6" />}
              title="Business Valuation"
              description="Get an accurate valuation for your business before listing."
              delay={5}
            />
          </div>
        </SiteContainer>
      </section>

      {/* Featured Listings */}
      <section className="py-20 bg-gray-50">
        <SiteContainer>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Featured Listings
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Browse our curated selection of high-quality businesses for sale
            </motion.p>
          </motion.div>
          
          <FeaturedListings />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-12 text-center"
          >
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-6 text-base font-medium group border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-700 transition-all duration-300"
              asChild
            >
              <Link href="/listings" className="flex items-center justify-center space-x-2">
                <span>View All Listings</span>
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </SiteContainer>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <SiteContainer>
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Ready to Start Your Journey?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto"
            >
              Join thousands of entrepreneurs who have successfully bought or sold businesses with us.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                size="lg" 
                className="px-8 py-6 text-base font-medium group bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                asChild
              >
                <Link href="/signup" className="flex items-center">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-6 text-base font-medium group border-2 border-white text-white hover:bg-white/10 hover:border-white/90 transition-all duration-300"
                asChild
              >
                <Link href="/contact" className="flex items-center">
                  Contact Sales
                </Link>
              </Button>
            </motion.div>
          </div>
        </SiteContainer>
      </section>
    </div>
  );
}
