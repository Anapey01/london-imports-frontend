import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';
import withPWAInit from "@ducanh2912/next-pwa";

const DEFAULT_API_ROOT = 'https://london-imports-api.onrender.com';
const apiRoot = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_ROOT;

let apiOrigin = DEFAULT_API_ROOT;
let apiHost = 'london-imports-api.onrender.com';

try {
  const parsed = new URL(apiRoot);
  apiOrigin = parsed.origin;
  apiHost = parsed.hostname;
} catch (e) {
  console.error("Failed to parse NEXT_PUBLIC_API_URL:", e);
}

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
      cleanupOutdatedCaches: true,
    runtimeCaching: [
      {
        // 1. Admin & Dashboard - NetworkOnly (Never cache or intercept admin portal)
        urlPattern: ({ url }) => 
          url.pathname.startsWith('/admin/') || 
          url.pathname.startsWith('/dashboard/admin/'),
        handler: 'NetworkOnly',
      },
      {
        urlPattern: ({ url }) => 
          url.origin.includes('paystack.co') || 
          url.origin.includes('paystack.com') || 
          url.origin.includes('cloudflareinsights.com') ||
          url.origin.includes('google-analytics.com') ||
          url.origin.includes('googletagmanager.com') ||
          url.origin.includes('google.com') ||
          url.origin.includes('google.com.gh') ||
          url.origin.includes('gstatic.com') ||
          url.origin.includes('sentry.io') ||
          url.origin.includes('vercel.live'),
        handler: 'NetworkOnly',
      },
      {
        // 2. Public API GETs (Products, Blogs, Public Vendors) - SWR with Server Cache-Control Enforcement
        urlPattern: ({ url, request }) => {
          if (url.origin !== apiOrigin || request.method !== 'GET') {
            return false;
          }

          // Aggressively normalize path BEFORE any matching:
          // 1. Collapse all runs of consecutive slashes (e.g. // → /)
          // 2. Ensure exactly one trailing slash
          const normalizedPath = url.pathname
            .replace(/\/{2,}/g, '/')          // collapse accidental duplicate slashes
            .replace(/\/+$/, '') + '/';        // strip trailing slashes, then add exactly one

          const segments = normalizedPath.split('/').filter(Boolean);
          if (segments[0] !== 'api' || segments[1] !== 'v1') return false;

          const resource = segments[2];
          const isPublicResource = ['products', 'blog', 'vendors'].includes(resource);
          if (!isPublicResource) return false;

          // List endpoints: /api/v1/products/, /api/v1/blog/, /api/v1/vendors/
          if (segments.length === 3) return true;

          // Detail endpoints: /api/v1/products/<slug>/, /api/v1/blog/<slug>/, /api/v1/vendors/<slug>/
          if (segments.length === 4) {
            const slug = segments[3];
            const isPrivateSlug = ['admin', 'preview', 'dashboard', 'profile', 'payouts'].includes(slug);
            return !isPrivateSlug;
          }

          const allowedDeepPaths = [
            '/api/v1/products/categories/',
            '/api/v1/products/banners/',
            '/api/v1/products/trending/'
          ];
          return allowedDeepPaths.includes(normalizedPath);
        },
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'api-data-swr',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 15 * 60,
          },
          cacheableResponse: {
            statuses: [200],
          },
        },
      },
      {
        // 3. API - Other methods (Auth, Orders POST) - NetworkOnly
        urlPattern: ({ url }) => url.origin === apiOrigin && url.pathname.startsWith('/api/v1/'),
        handler: 'NetworkOnly',
      },
      {
        // 4. HTML documents (initial page loads) - NetworkFirst
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
        // 5. RSC Payloads & Data - NetworkFirst with shorter expiration
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
        // 6. Static Assets - SWR
        urlPattern: ({ url }) => url.pathname.includes('/_next/static/') || url.pathname.includes('/_next/image'),
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-assets',
        },
      },
      {
        // 7. External Images (Cloudinary, Wikipedia, etc.) - SWR
        urlPattern: ({ url }) =>
          url.origin === 'https://res.cloudinary.com' ||
          url.origin.includes('wikimedia.org') ||
          (url.origin === apiOrigin && url.pathname.startsWith('/media/')),
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

const isDev = process.env.NODE_ENV === "development";

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.paystack.co https://static.cloudflareinsights.com https://browser.sentry-cdn.com https://*.sentry.io https://www.googletagmanager.com https://*.googletagmanager.com https://vercel.live https://*.google.com https://*.google.com.gh https://*.gstatic.com https://accounts.google.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://paystack.com https://accounts.google.com",
  `img-src 'self' data: https: blob: https://res.cloudinary.com ${apiOrigin} https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://upload.wikimedia.org https://*.google.com https://*.google.com.gh https://*.gstatic.com ${isDev ? 'http://127.0.0.1:8000 http://localhost:8000' : ''}`,
  "font-src 'self' https://fonts.gstatic.com",
  `connect-src 'self' https://res.cloudinary.com ${apiOrigin} http://127.0.0.1:8000 http://localhost:8000 https://api.paystack.co https://js.paystack.co https://checkout.paystack.com https://paystack.com https://*.sentry.io https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://www.googletagmanager.com https://stats.g.doubleclick.net https://*.google.com.gh https://*.google.com https://*.gstatic.com https://accounts.google.com https://vercel.live https://*.wikimedia.org`,
  "frame-src 'self' https://js.paystack.co https://checkout.paystack.com https://vercel.live https://accounts.google.com",
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  "manifest-src 'self'",
  "media-src 'self' https://res.cloudinary.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  isDev ? "" : "upgrade-insecure-requests"
].filter(Boolean).join('; ');

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
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: apiHost,
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
            value: `<${apiOrigin}>; rel=preconnect`
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
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(self), geolocation=(self), browsing-topics=()'
          }
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/feed/google/:path*',
        destination: `${DEFAULT_API_ROOT}/api/feed/google/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/products',
        has: [
          {
            type: 'query',
            key: 'category',
            value: '(?<slug>.*)',
          },
        ],
        destination: '/products/category/:slug',
        permanent: true,
      },
    ];
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

