# SuccessionAsia - SME Marketplace

A modern, high-performance web application for buying and selling SMEs (Small and Medium Enterprises) in Southeast Asia. Built with Next.js, Supabase, and optimized for the best user experience.

## Features

- **Progressive Web App (PWA)** - Installable on devices and works offline
- **Performance Optimized** - Fast page loads and smooth interactions
- **Modern UI/UX** - Clean, responsive design with dark mode support
- **Secure Authentication** - Powered by Supabase Auth with email/password and social logins
- **Real-time Updates** - Instant updates with WebSockets

## Performance Optimizations

### Frontend

- **Code Splitting** - Automatic code splitting for faster page loads
- **Image Optimization** - Automatic image optimization with WebP/AVIF support
- **Service Worker** - Offline support and asset caching
- **Font Optimization** - Self-hosted fonts with font-display: swap
- **Lazy Loading** - Components and images load only when needed
- **Preloading** - Critical resources are preloaded for faster rendering

### Backend

- **Database Query Optimization** - Efficient queries with proper indexing
- **Caching Layer** - Redis caching for frequently accessed data
- **Connection Pooling** - Optimized database connections
- **CDN Integration** - Global content delivery for static assets

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Supabase account and project
- Redis (for production caching)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/successionasia.git
   cd successionasia
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Update the environment variables in `.env.local` with your Supabase credentials and other configurations.

4. Generate PWA assets (icons, splash screens):
   ```bash
   npm run generate-pwa-assets
   ```
   
   > Note: Place your app icon at `public/logo.png` and splash screen at `public/splash-source.png` before running this command.

5. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production

1. Generate optimized production build:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start:prod
   ```

## PWA Features

- **Installable** - Add to home screen on mobile devices
- **Offline Support** - Browse content without an internet connection
- **Fast Loading** - Assets are cached for instant loading on repeat visits
- **App-like Experience** - Full-screen mode and native app feel

## Performance Monitoring

- **Web Vitals** - Real-user performance metrics
- **Error Tracking** - Client and server error monitoring
- **Analytics** - User behavior and performance insights

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate test coverage report:
```bash
npm run test:coverage
```

## Deployment

The application is optimized for deployment on Vercel, but can be deployed to any Node.js hosting platform.

### Vercel Deployment

1. Push your code to a GitHub/GitLab repository
2. Import the repository to Vercel
3. Set up environment variables in the Vercel project settings
4. Deploy!

## Browser Support

The application is tested and works on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS 13+)
- Chrome for Android

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

For support, please open an issue in the GitHub repository.
