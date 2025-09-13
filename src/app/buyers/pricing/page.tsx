import { PricingHeader } from '@/components/pricing-header';
import { PricingSection } from '@/components/pricing-section';

export default function BuyerPricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PricingHeader 
        title="Simple, Transparent Pricing for Buyers"
        description="Choose the plan that works best for your business acquisition journey. No hidden fees, no surprises."
        type="buyer"
      />
      <PricingSection />
    </div>
  );
}
