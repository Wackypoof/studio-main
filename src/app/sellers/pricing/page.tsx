import { Button } from "@/components/ui/button";
import { CheckCircle2, User } from "lucide-react";
import Link from "next/link";

type PricingTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  icon?: React.ReactNode;
};

const PricingTierCard = ({ name, price, description, features, cta, popular = false, icon }: PricingTier) => (
  <div className={`relative bg-white rounded-2xl shadow-sm border ${
    popular ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200'
  } p-8 h-full flex flex-col`}>
    {popular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <span className="bg-blue-600 text-white text-xs font-medium px-4 py-1 rounded-full">
          Most Popular
        </span>
      </div>
    )}
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
      </div>
      <div className="flex items-baseline mb-2">
        <span className="text-4xl font-bold text-gray-900">{price}</span>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="mt-auto">
      <Button className={`w-full ${popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`} asChild>
        <Link href="/sign-up">{cta}</Link>
      </Button>
    </div>
  </div>
);

const sellerPricingTiers: PricingTier[] = [
  {
    name: "Standard",
    price: "5%",
    description: "For businesses under $1M in annual revenue",
    features: [
      "Business valuation",
      "Professional listing creation",
      "Basic marketing",
      "Email support"
    ],
    cta: "List My Business",
    icon: <User className="h-6 w-6 text-blue-600" />
  },
  {
    name: "Premium",
    price: "8%",
    description: "For businesses over $1M in annual revenue",
    features: [
      "Everything in Standard",
      "Premium placement",
      "Dedicated broker",
      "Marketing boost",
      "Priority support"
    ],
    cta: "Get Premium",
    popular: true,
    icon: <User className="h-6 w-6 text-blue-600" />
  }
];

export default function SellerPricingPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pricing for Sellers</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sell your business with our success-based pricing model
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {sellerPricingTiers.map((tier, index) => (
            <PricingTierCard key={index} {...tier} />
          ))}
        </div>

        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                question: "How are the fees calculated?",
                answer: "Our fees are calculated as a percentage of the final sale price. The Standard plan charges 5% and the Premium plan charges 8% of the sale price."
              },
              {
                question: "When do I pay the fees?",
                answer: "Fees are only due upon successful sale of your business. There are no upfront costs or hidden fees."
              },
              {
                question: "How long does it take to sell my business?",
                answer: "The time to sell varies based on your business type, price, and market conditions. Our Premium plan includes marketing boosts to help speed up the process."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
