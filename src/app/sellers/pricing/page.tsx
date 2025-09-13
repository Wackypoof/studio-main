import { PricingSection } from '@/components/pricing-section';
import { PricingHeader } from '@/components/pricing-header';

export default function SellerPricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PricingHeader 
        title="Sell Your Business with Confidence"
        description="Choose the right plan to maximize your business's value and find the perfect buyer."
        type="seller"
      />
      <PricingSection />
    </div>
  );
}
