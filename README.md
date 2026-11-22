# PizzaHub (Client)

PizzaHub is a pizza ordering platform with three roles: **Customer**, **Vendor** and **Admin**. Customers browse and order pizza, vendors manage menu items and orders (with a Premium subscription), and admins moderate users and menu items.

- **Live site:** [client live URL]
- **Server repo:** [server GitHub URL]
- **Server live URL:** [server live URL]

## Admin credentials (for review)

- Email: [admin email]
- Password: [admin password]

## Features

- Email/password and Google sign in (Better Auth), with role chosen at sign up (Customer or Vendor)
- Home page with hero, featured items, categories and how it works
- Browse Menu with search, category and location filters, price range, price sorting and pagination
- Item details (protected) with image gallery and order form
- **Customer dashboard:** overview with stats and chart, my orders (cancel pending orders), profile settings
- **Vendor dashboard:** overview, add and edit menu items with ImgBB image upload, my menu items (available/unavailable, delete), customer orders (accept or reject), subscription, profile
- **Admin dashboard:** overview, manage users (block/unblock), manage menu items (approve, reject, deactivate, delete), transactions
- Vendor Premium subscription with Stripe Checkout (unlimited items). Free vendors can have 3 active items
- Dark mode and an order progress timeline (optional features)
- Responsive layout, loading, empty and error states, custom 404 page

## Tech stack

Next.js (App Router, JavaScript), Tailwind CSS v4, shadcn/ui, Better Auth (MongoDB adapter, JWT plugin), Motion, Recharts, Sonner, ImgBB.

## Getting started

npm install
npm run dev


Create `.env.local`:

NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_KEY=your_imgbb_key
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=a_long_random_secret
MONGODB_URI=your_mongodb_connection_string
DB_NAME=your_database_name
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

## Challenge notes

### Search, filter and sort

The Browse Menu page keeps all filters in the URL query string, so a filtered view can be shared and the back button works. The server reads these parameters from `GET /api/menu-items`:

| Parameter | Meaning |
| --- | --- |
| `q` | Case-insensitive search on item name |
| `category` | Exact category name |
| `location` | Exact location |
| `minPrice`, `maxPrice` | Price range |
| `sort` | `price_asc` or `price_desc` (default: newest first) |
| `page`, `limit` | Pagination |

### How the JWT flow works

1. Better Auth runs inside the Next.js app and signs users in (email/password or Google).
2. Its JWT plugin issues a short-lived token. The client gets a fresh one before every API call with `authClient.token()` and sends it as `Authorization: Bearer <token>`.
3. The Express server verifies the token signature against the Better Auth JWKS endpoint (`jose`), and checks issuer and audience.
4. The server then loads the user from the database. Blocked users get `403`, and the effective plan is computed from the subscription expiry date.
5. Route guards (`verifyRole("vendor")` and similar) allow only the right role. The role is never taken from the request body.

### Premium is activated only by a verified webhook

The success page after Stripe Checkout never upgrades anyone. The server upgrades a vendor only after Stripe sends a `checkout.session.completed` event with a valid signature. The success page just waits and re-checks the plan.