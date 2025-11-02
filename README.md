<div align="center">
  <h1>SuccessionAsia</h1>
  <h3>Modern SME Marketplace Platform</h3>
  
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

  A high-performance web platform connecting SME buyers and sellers across Southeast Asia. Built with modern web technologies for speed, security, and scalability.

  [View Demo](#) • [Report Bug](https://github.com/your-org/successionasia/issues) • [Request Feature](https://github.com/your-org/successionasia/issues)
</div>

## ✨ Features

### 🚀 Core Functionality
- **Business Listings** - Browse and search for SMEs with detailed profiles
- **Secure Authentication** - End-to-end encrypted auth with Supabase
- **NDA Management** - Built-in NDA workflows for sensitive information
- **Real-time Chat** - Instant communication between buyers and sellers
- **Analytics Dashboard** - Track listing performance and user engagement

### 🛠 Technical Highlights
- **PWA Support** - Installable on devices with offline capabilities
- **Performance Optimized** - 90+ Lighthouse scores out of the box
- **Type Safety** - Full TypeScript support for better developer experience
- **Responsive Design** - Works seamlessly across all devices
- **Modular Architecture** - Clean, maintainable code structure

## 🚀 Performance Optimizations

| Area | Optimization | Impact |
|------|-------------|--------|
| **Frontend** | Code Splitting | Faster initial page loads |
| | Image Optimization (WebP/AVIF) | Reduced bandwidth usage |
| | Service Worker | Offline support & instant loading |
| | Font Optimization | Improved text rendering |
| | Lazy Loading | Better resource utilization |
| **Backend** | Database Indexing | Faster queries |
| | Redis Caching | Reduced database load |
| | Connection Pooling | Better resource management |
| | CDN Integration | Global content delivery |

## 🏗 Architecture

```
src/
├── app/                    # App router pages and layouts
├── components/             # Reusable UI components
├── lib/                    # Core business logic
│   ├── supabase/          # Database client & types
│   └── utils/             # Utility functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── styles/                # Global styles and themes
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- [Supabase](https://supabase.com/) account and project
- [Redis](https://redis.io/) (for production caching)

### ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/successionasia.git
   cd successionasia
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env.local`
   - Update with your Supabase credentials and other configurations
   ```bash
   cp .env.example .env.local
   ```

4. **Generate PWA Assets**
   ```bash
   npm run generate-pwa-assets
   ```
   > **Note**: Place your app icon at `public/logo.png` (1024x1024px) and splash screen at `public/splash-source.png` (1200x630px)

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### 🏗 Building for Production

```bash
# Create production build
npm run build

# Start production server
npm run start:prod
```

## 🧪 Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📱 PWA Features

- **Installable** - Add to home screen on mobile devices
- **Offline First** - Full functionality without internet
- **Fast Loading** - Instant loading with service workers
- **App-like** - Native app experience
- **Push Notifications** - Real-time updates (coming soon)

## 📊 Monitoring & Analytics

- **Sentry** - Error tracking and performance monitoring
- **Vercel Analytics** - Real-user metrics
- **Custom Dashboards** - Business and performance insights

## 🤝 Contributing

Contributions are what make the open source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com

Project Link: [https://github.com/your-org/successionasia](https://github.com/your-org/successionasia)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [All Contributors](https://github.com/your-org/successionasia/contributors)

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
