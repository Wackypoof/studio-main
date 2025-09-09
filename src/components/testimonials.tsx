import { Star } from 'lucide-react';

type Testimonial = {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Michael S.',
    role: 'Founder',
    company: 'TechStart',
    content: 'Acquire.com is the future for project builders. The platform made selling my SaaS business seamless and efficient. Highly recommended!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Sarah K.',
    role: 'CEO',
    company: 'GrowthLabs',
    content: 'The team at Acquire.com provided exceptional support throughout the entire process. We received multiple offers and closed the deal above asking price.',
    rating: 5,
  },
  {
    id: 3,
    name: 'David L.',
    role: 'Entrepreneur',
    company: 'NextWave',
    content: 'As a first-time buyer, I was nervous about the process. The platform and team made it incredibly smooth and transparent.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Emily R.',
    role: 'Founder',
    company: 'SaaSScale',
    content: 'Sold my business within 3 months of listing. The quality of buyers was exceptional and the process was handled professionally.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Thousands of Entrepreneurs</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our community has to say.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="text-lg text-gray-700 mb-6">"{testimonial.content}"</blockquote>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <div className="font-medium text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-1 text-sm text-gray-500">
            <span className="font-medium">4.9/5.0</span>
            <span>•</span>
            <span>Based on 1,200+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}
