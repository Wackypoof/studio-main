const fs = require('fs');
const path = require('path');

// Define the pages to include in the sitemap
const pages = [
  '/',
  '/login',
  '/sign-up',
  '/forgot-password',
  '/dashboard',
  '/dashboard/analytics',
  '/dashboard/browse-listings',
  '/dashboard/leads',
  '/dashboard/listings',
  '/dashboard/messages',
  '/dashboard/my-deals',
  '/dashboard/ndas',
  '/dashboard/offers',
  '/dashboard/saved-listings',
  '/dashboard/settings',
  '/dashboard/verification',
  '/listings',
  '/buyers/pricing',
  '/sellers/pricing',
];

// Get the current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

// Generate the sitemap XML
const generateSitemap = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://successionasia.com';
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
    <url>
      <loc>${baseUrl}${page}</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${page === '/' ? '1.0' : '0.8'}</priority>
    </url>\n`
    )
    .join('')}
</urlset>`;

  // Write the sitemap to the public directory
  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'sitemap.xml'),
    sitemap
  );
  
  console.log('Sitemap generated successfully!');
};

generateSitemap();
