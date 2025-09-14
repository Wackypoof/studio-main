import Link from 'next/link';
import { FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';

const navigation = {
  main: [
    { name: 'About', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Security', href: '/security' },
    { name: 'Sitemap', href: '/sitemap' },
  ],
  social: [
    {
      name: 'Twitter',
      href: 'https://twitter.com/successionasia',
      icon: FaTwitter,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/successionasia',
      icon: FaLinkedin,
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/successionasia',
      icon: FaYoutube,
    },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">SuccessionAsia</span>
            </div>
            <p className="text-gray-500 text-base">
              The leading marketplace for buying and selling SMEs in Southeast Asia.
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  For Buyers
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link href="/buyers/how-it-works" className="text-base text-gray-500 hover:text-gray-900">
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link href="/buyers/featured" className="text-base text-gray-500 hover:text-gray-900">
                      Featured Listings
                    </Link>
                  </li>
                  <li>
                    <Link href="/buyers/guide" className="text-base text-gray-500 hover:text-gray-900">
                      Buying Guide
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  For Sellers
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link href="/sellers/valuation" className="text-base text-gray-500 hover:text-gray-900">
                      Get a Valuation
                    </Link>
                  </li>
                  <li>
                    <Link href="/sellers/success-stories" className="text-base text-gray-500 hover:text-gray-900">
                      Success Stories
                    </Link>
                  </li>
                  <li>
                    <Link href="/sellers/process" className="text-base text-gray-500 hover:text-gray-900">
                      Selling Process
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  Company
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.main.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-base text-gray-500 hover:text-gray-900">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  Legal
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-base text-gray-500 hover:text-gray-900">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} SuccessionAsia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
