import { CheckCircle2, Search, BarChart3, ShieldCheck, Zap, TrendingUp, Users, FileText, Handshake } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center mb-4">
      <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mr-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

export function BuyersSellersSection() {
  const buyersFeatures = [
    {
      icon: <Search className="h-5 w-5" />,
      title: "Curated Listings",
      description: "Access vetted, high-quality businesses with verified financials and growth potential."
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Financial Transparency",
      description: "View detailed revenue, profit margins, and growth metrics for every listing."
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "Secure Transactions",
      description: "Complete transactions with confidence using our secure escrow service and legal support."
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Quick Closing",
      description: "Our streamlined process helps you close deals faster with minimal hassle."
    }
  ];

  const sellersFeatures = [
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Maximize Value",
      description: "Reach thousands of qualified buyers to get the best possible price for your business."
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Targeted Exposure",
      description: "Your listing is shown to relevant buyers actively looking for businesses like yours."
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Deal Support",
      description: "Get expert guidance through every step of the selling process."
    },
    {
      icon: <Handshake className="h-5 w-5" />,
      title: "No Upfront Costs",
      description: "Pay only when you successfully close a deal with our performance-based pricing."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Buyers Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">For Buyers</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find and acquire the perfect business to grow or add to your portfolio
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {buyersFeatures.map((feature, index) => (
              <FeatureCard key={`buyer-${index}`} {...feature} />
            ))}
          </div>
          
          <div className="text-center">
            <Button asChild size="lg" className="px-8">
              <Link href="/buyers">Browse Businesses</Link>
            </Button>
          </div>
        </div>

        {/* Sellers Section */}
        <div className="pt-16 border-t border-gray-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">For Sellers</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sell your business quickly and for the best price with our expert support
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {sellersFeatures.map((feature, index) => (
              <FeatureCard key={`seller-${index}`} {...feature} />
            ))}
          </div>
          
          <div className="text-center">
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link href="/sellers">Sell Your Business</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
