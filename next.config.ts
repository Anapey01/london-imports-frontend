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
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [
      {
        // 1. Paystack - EXCLUDE EVERYTHING from Service Worker to prevent checkout freezes
        urlPattern: ({ url }) => url.origin.includes('paystack.co') || url.origin.includes('paystack.com'),
        handler: 'NetworkOnly',
      },
      {
        // 2. HTML documents (initial page loads) - NetworkFirst to avoid broken offline states
        urlPattern: ({ request }) => request.mode === 'navigate',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'pages-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60,
          },
        },
      },
      {
        // 3. RSC Payloads & Data - MUST be NetworkFirst to prevent navigation hangs (304 issues)
        urlPattern: ({ url }) => url.searchParams.has('_rsc') || url.pathname.includes('/_next/data/'),
        handler: 'NetworkFirst',
        options: {
          cacheName: 'next-data',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 1 * 60 * 60, // 1 hour
          },
        },
      },
      {
        // 4. Static Assets - SWR is fine here
        urlPattern: ({ url }) => url.pathname.includes('/_next/static/') || url.pathname.includes('/_next/image'),
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-assets',
        },
      },
      {
        // 5. API - NetworkFirst to ensure fresh basket/order data during checkout
        urlPattern: ({ url }) => url.origin === 'https://london-imports-api.onrender.com' && url.pathname.startsWith('/api/v1/'),
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          cacheableResponse: { statuses: [0, 200] },
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60,
          },
        },
      },
      {
        // 6. External Images (Cloudinary, Wikipedia, etc.) - SWR to allow updates
        urlPattern: ({ url }) =>
          url.origin === 'https://res.cloudinary.com' ||
          url.origin.includes('wikimedia.org') ||
          (url.origin === 'https://london-imports-api.onrender.com' && url.pathname.startsWith('/media/')),
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'image-cache',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
        },
      },
    ],
  },
});

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.paystack.co https://browser.sentry-cdn.com https://*.sentry.io https://www.googletagmanager.com https://vercel.live",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: https: blob: https://res.cloudinary.com https://london-imports-api.onrender.com https://*.google-analytics.com https://*.googletagmanager.com https://upload.wikimedia.org",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://res.cloudinary.com https://london-imports-api.onrender.com https://api.paystack.co https://js.paystack.co https://checkout.paystack.com https://*.sentry.io https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://www.googletagmanager.com https://vercel.live",
  "frame-src 'self' https://js.paystack.co https://checkout.paystack.com https://vercel.live",
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  "manifest-src 'self'",
  "media-src 'self' https://res.cloudinary.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests"
].join('; ');

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
            value: CSP
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
  }
);

