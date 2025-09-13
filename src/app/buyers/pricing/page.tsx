import { Button } from "@/components/ui/button";
import { CheckCircle2, Briefcase } from "lucide-react";
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
        {!price.includes('$0') && !price.includes('%') && (
          <span className="text-gray-500 ml-1 text-sm">+ 2.5% success fee</span>
        )}
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

const buyerPricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    description: "Get started with our marketplace",
    features: [
      "Browse all listings",
      "Save favorite businesses",
      "Basic search filters",
      "Email support"
    ],
    cta: "Get Started",
    icon: <Briefcase className="h-6 w-6 text-blue-600" />
  },
  {
    name: "Pro Buyer",
    price: "$99",
    description: "For serious buyers",
    features: [
      "Everything in Free",
      "Advanced search filters",
      "Priority support",
      "Financial analysis tools",
      "Deal structuring assistance"
    ],
    cta: "Choose Pro",
    popular: true,
    icon: <Briefcase className="h-6 w-6 text-blue-600" />
  }
];

export default function BuyerPricingPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pricing for Buyers</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find and acquire the perfect business with our transparent pricing options
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {buyerPricingTiers.map((tier, index) => (
            <PricingTierCard key={index} {...tier} />
          ))}
        </div>

        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                question: "Is there a free trial?",
                answer: "Yes, our Free plan is available with no time limit. You can upgrade to Pro anytime to unlock additional features."
              },
              {
                question: "How does the success fee work?",
                answer: "We charge a small success fee on closed deals to keep our platform running. This helps us maintain quality listings and support."
              },
              {
                question: "Can I switch plans later?",
                answer: "Absolutely! You can upgrade or downgrade your plan at any time from your account settings."
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
