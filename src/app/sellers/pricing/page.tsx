import { PricingSection } from '@/components/pricing-section';
import { Header } from '@/components/Header';

export default function SellerPricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Sell Your Business with Confidence
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the right plan to maximize your business's value and find the perfect buyer.
          </p>
        </div>
        <PricingSection userType="seller" />
      </div>
    </div>
  );
}
