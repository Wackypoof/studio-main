import { Button } from '@/components/ui/button';
import { CheckCircle2, TrendingUp, Users, FileText, Handshake } from 'lucide-react';
import Link from 'next/link';
import { SiteContainer } from '@/components/site-container';

export default function SellersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <SiteContainer>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sell Your Business with Confidence
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Connect with qualified buyers and get the best possible price for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-6 text-base font-medium" asChild>
                <Link href="/sell">List Your Business</Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-base font-medium" asChild>
                <Link href="/pricing">View Seller Fees</Link>
              </Button>
            </div>
          </div>
        </SiteContainer>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <SiteContainer>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Sell With Us</h2>
            <p className="text-xl text-gray-600">
              We help you get the best deal with minimal hassle and maximum value.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: "Maximize Value",
                description: "Reach thousands of qualified buyers to get the best possible price for your business."
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Targeted Exposure",
                description: "Your listing is shown to relevant buyers actively looking for businesses like yours."
              },
              {
                icon: <FileText className="h-6 w-6" />,
                title: "Deal Support",
                description: "Get expert guidance through every step of the selling process."
              },
              {
                icon: <Handshake className="h-6 w-6" />,
                title: "No Upfront Costs",
                description: "Pay only when you successfully close a deal with our performance-based pricing."
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

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <SiteContainer>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">
              A simple, transparent process to sell your business
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "List Your Business",
                description: "Create a detailed listing with all the necessary information about your business."
              },
              {
                step: "2",
                title: "Connect with Buyers",
                description: "We'll match you with qualified buyers and help facilitate the conversation."
              },
              {
                step: "3",
                title: "Close the Deal",
                description: "Complete the sale with our secure payment processing and legal support."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </SiteContainer>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <SiteContainer>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Sell Your Business?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of sellers who have successfully sold their businesses through our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8 py-6 text-base font-medium" asChild>
                <Link href="/sell">List Your Business</Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-6 text-base font-medium text-blue-700 bg-white hover:bg-blue-50" asChild>
                <Link href="/pricing">View Seller Fees</Link>
              </Button>
            </div>
          </div>
        </SiteContainer>
      </section>
    </div>
  );
}
