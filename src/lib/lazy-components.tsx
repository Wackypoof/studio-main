import { lazy, ComponentType } from 'react';

// Lazy load heavy components for better performance
export const LazyAdvancedFilters = lazy(() =>
  import('@/components/advanced-filters').then(module => ({
    default: module.AdvancedFilters
  }))
);

export const LazyCollections = lazy(() =>
  import('@/components/collections').then(module => ({
    default: module.Collections
  }))
);

export const LazyDashboardCollections = lazy(() =>
  import('@/components/dashboard-collections').then(module => ({
    default: module.DashboardCollections
  }))
);

export const LazyFeaturedListings = lazy(() =>
  import('@/components/featured-listings').then(module => ({
    default: module.FeaturedListings
  }))
);

export const LazyAnimatedStats = lazy(() =>
  import('@/components/animated-stats').then(module => ({
    default: module.AnimatedStats
  }))
);

// Skip NDA form for now - path issue
// export const LazyNDAForm = lazy(() =>
//   import('@/components/nda/nda-form').then(module => ({
//     default: module.default
//   }))
// );

export const LazyPricingSection = lazy(() =>
  import('@/components/pricing-section').then(module => ({
    default: module.PricingSection
  }))
);

export const LazyProcessFlow = lazy(() =>
  import('@/components/process-flow').then(module => ({
    default: module.ProcessFlow
  }))
);

export const LazyTestimonials = lazy(() =>
  import('@/components/testimonials').then(module => ({
    default: module.Testimonials
  }))
);

// Skip charts for now - path issue
// export const LazyCharts = lazy(() =>
//   import('@/components/charts').then(module => ({
//     default: module.default
//   }))
// );

// Lazy load dashboard components
export const LazyListingTable = lazy(() =>
  import('@/components/dashboard/ListingTable').then(module => ({
    default: module.ListingTable
  }))
);

export const LazyVerificationAlert = lazy(() =>
  import('@/components/dashboard/verification-alert').then(module => ({
    default: module.VerificationAlert
  }))
);

// Type-safe lazy component wrapper
export function withLazyLoading<T extends ComponentType<any>>(
  LazyComponent: React.LazyExoticComponent<T>
) {
  return LazyComponent;
}
