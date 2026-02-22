import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  extendDefaultRuntimeCaching: true,
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: ({ request }) => request.mode === 'navigate',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'pages-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
          networkTimeoutSeconds: 5, // Fallback to cache faster if network is slow
        },
      },
      {
        urlPattern: ({ request, url }) => {
          return request.destination === 'document' ||
            url.pathname.includes('/_next/data/') ||
            url.searchParams.has('_rsc');
        },
        handler: 'NetworkFirst',
        options: {
          cacheName: 'rsc-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
        },
      },
      {
        urlPattern: /^https:\/\/london-imports-api\.onrender\.com\/api\/(products|orders|faq|categories|reviews)\//,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
          networkTimeoutSeconds: 10,
        },
      },
      {
        urlPattern: /^https:\/\/res\.cloudinary\.com\//,
        handler: 'CacheFirst',
        options: {
          cacheName: 'cloudinary-images',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
      {
        urlPattern: /^https:\/\/london-imports-api\.onrender\.com\/media\//,
        handler: 'CacheFirst',
        options: {
          cacheName: 'media-images',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
    ],
  },
});

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.ts',
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 3600,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'london-imports-api.onrender.com',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // Tree-shake unused exports from these packages
    optimizePackageImports: [
      'lucide-react',
      '@tanstack/react-query',
      'date-fns',
      'lodash',
      'react-hot-toast'
    ],
  },
  // Modularize icon imports for smaller bundles
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
      preventFullImport: true, // Error if someone imports the whole package
    },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Link',
            value: '<https://london-imports-api.onrender.com>; rel=preconnect'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://london-imports-api.onrender.com https://js.paystack.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://paystack.com https://checkout.paystack.com; img-src 'self' data: blob: https://res.cloudinary.com https://london-imports-api.onrender.com https://upload.wikimedia.org https://checkout.paystack.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://london-imports-api.onrender.com https://www.google-analytics.com https://api.paystack.co https://checkout-api.paystack.co; frame-src 'self' https://www.google.com https://www.youtube-nocookie.com https://checkout.paystack.com; frame-ancestors 'none'; object-src 'none';"
          }
        ],
      },
    ]
  },
};

export default withSentryConfig(
  withPWA(bundleAnalyzer(nextConfig)),
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "londons-imports",
    project: "javascript-nextjs",

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    // transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",
  }
);

