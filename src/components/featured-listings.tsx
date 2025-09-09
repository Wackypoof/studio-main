import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

type Listing = {
  id: string;
  title: string;
  description: string;
  price: string;
  revenue: string;
  profit: string;
  category: string;
};

const featuredListings: Listing[] = [
  {
    id: '1',
    title: 'AI-Powered Content Creation Platform',
    description: 'SaaS platform that helps marketers create high-quality content using AI. 3 years in business with 200+ paying customers.',
    price: '$1,200,000',
    revenue: '$35,000 MRR',
    profit: '25% Margin',
    category: 'SaaS',
  },
  {
    id: '2',
    title: 'E-commerce Fashion Brand',
    description: 'Profitable D2C fashion brand with strong social media presence and loyal customer base. 5 years in business.',
    price: '$850,000',
    revenue: '$120,000 Annual',
    profit: '30% Margin',
    category: 'E-commerce',
  },
  {
    id: '3',
    title: 'SEO Content Agency',
    description: 'Established content marketing agency with retainer clients and a team of 10 writers. 4 years in business.',
    price: '$450,000',
    revenue: '$25,000 MRR',
    profit: '40% Margin',
    category: 'Agency',
  },
];

export function FeaturedListings() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Businesses For Sale</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hand-picked businesses with verified financials and growth potential
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-3">
                      {listing.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{listing.title}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{listing.price}</div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{listing.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-500">Revenue</div>
                    <div className="font-medium">{listing.revenue}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Profit</div>
                    <div className="font-medium">{listing.profit}</div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/listings/${listing.id}`}>
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/listings">
              View All Listings <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
