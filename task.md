# Londom Imports - Pre-Order Platform

## Phase 1: Project Foundation
- [x] Set up Next.js frontend project with Tailwind CSS
- [x] Set up Django backend project with DRF
- [x] Configure PostgreSQL database connection (SQLite for dev)
- [ ] Set up Redis for caching and queues
- [x] Configure project structure and environment variables

## Phase 2: Backend Core
- [x] Define order lifecycle state machine (see order_lifecycle.md)
- [x] Design database models (Users, Vendors, Products, Orders, Batches, Deliveries)
- [x] Implement user authentication (JWT with roles)
- [x] Create vendor management APIs
- [x] Create product management APIs
- [x] Implement order management with batch processing
- [ ] Set up Celery for background tasks
- [x] Configure Django Admin customization

## Phase 3: Payment Integration
- [x] Integrate Paystack
- [x] Implement Mobile Money support (MTN, Vodafone, AirtelTigo)
- [x] Build payment state machine (escrow-like flow)
- [x] Implement split payments (platform fee vs vendor payout)
- [x] Create payment reconciliation system

## Phase 4: Frontend Development
- [x] Define website UX specification (see website_specification.md)
- [x] Create authentication flows (Customer, Vendor, Admin)
- [x] Build product browsing and search
- [x] Implement shopping cart (Zustand)
- [x] Create order placement flow
- [x] Build order tracking with real-time updates
- [ ] Create vendor dashboard
- [ ] Build admin dashboard

## Phase 5: Notifications
- [x] Integrate SMS provider (Hubtel/Termii)
- [x] Configure email notifications (Postmark/SES)
- [x] Implement event-driven notification system

## Phase 6: Operations & Analytics
- [x] Build operational admin views
- [x] Implement fulfillment tracking
- [x] Create vendor reliability scoring
- [x] Set up PostHog analytics (placeholder)
- [x] Build business metrics dashboard (Celery tasks)

## Phase 7: Deployment
- [ ] Configure CI/CD with GitHub Actions
- [ ] Deploy backend to DigitalOcean
- [ ] Deploy frontend to Vercel
- [ ] Set up managed PostgreSQL
- [ ] Configure production environment
