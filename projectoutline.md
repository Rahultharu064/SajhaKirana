2. UI Wireframes (page-by-page)

Below are wireframe descriptions — use them to implement React pages and Tailwind layouts. Each page includes primary sections and expected components.

Public Website (No Login Required)
Home Page — /

Header: logo (left), search bar (center), cart icon & login CTA (right)

Hero: full-width banner with CTA buttons (Shop Now / Explore Categories)

Sections (stacked): Featured products (grid), Best-selling (carousel), New arrivals (grid), Categories preview (icon cards)

Footer: columns (About, Support, Policies, Contact/WhatsApp)

Product Listing Page — /category/:slug or /search?q=

Left rail (desktop): category tree + filters (Price slider, brand checkboxes, rating stars, availability toggle)

Top bar: breadcrumb, sort dropdown (Low→High, High→Low, Popularity, Newest), results count

Main: product grid (3–4 columns) with cards (image, title, variant, price, rating, add-to-cart)

Pagination or infinite scroll at bottom

Product Details Page (PDP) — /product/:id or /product/:slug

Left: image gallery (main image + thumbnails)

Right: product title, price, MRP, discount badge, stock status, variant selectors, quantity selector, large Add to Cart button, wishlist heart

Below: tabs (Description, Ingredients, Reviews) and Related products carousel

Search Overlay / Page — /search?q=

Search input (persisted), instant suggestions dropdown with mini product cards and recent searches

Results follow product listing layout with filters

Static Pages

About /about, Contact /contact, Policies /privacy, /terms, /returns — simple content-centered pages with headings and card layout sections

User (Authenticated) Pages
Auth Pages

Login /auth/login — email/phone and password, OTP button for phone

Register /auth/register — name, email, phone, password, confirm

Forgot Password /auth/forgot

Profile / Account

Profile /account — avatar, name, phone, edit button

Addresses /account/addresses — list, add/edit forms

Orders /account/orders — list with order status pills and link to order details

Order detail /account/orders/:id — timeline, items, invoice download

Cart & Checkout

Cart /cart — list items, change qty, coupon input, subtotal summary, proceed to checkout

Checkout /checkout — select address, delivery options, payment method, review, place order

Checkout success /order-confirmation/:id

Admin Pages (You Only)

All pages behind /admin with separate admin login /admin/login.

Admin Dashboard /admin

KPIs row: revenue, orders, customers, low stock

Charts: sales trend, top products

Notifications: low-stock alerts, new orders

Product Management /admin/products

Table/list: search, create button, bulk import (CSV), each row edit/delete

Product edit page /admin/products/:id with tabs (Details, Inventory, SEO)

Orders /admin/orders

Order list with filters (status, payment method) and quick actions (print, change status)

Order detail /admin/orders/:id with admin notes, assign delivery, refund actions

Inventory /admin/inventory

SKU table, stock adjustments modal, import CSV

Coupons /admin/coupons and Promotions /admin/promotions
Settings /admin/settings

Payment keys, tax, delivery charges, theme upload, backup trigger

Delivery Staff App (Optional)

/delivery/login and /delivery/orders (list) and /delivery/order/:id to update statuses and enter OTP

3. Component inventory (reusable)

Header (logo, search, nav, cart, auth)

Footer (links, contact, socials)

ProductCard (image, title, variant, price, rating, actions)

ProductGrid (responsive grid wrapper)

FilterPanel (price slider, checkboxes, toggles)

ProductGallery (main image + thumbnails)

QuantitySelector (plus/minus input)

VariantSelector (buttons or select)

Badge (discount, new, out-of-stock)

Modal (generic)

Toast notifications

AdminTable (searchable, sortable table)

KPI card, LineChart, BarChart components

Shared types (TS): Product, Variant, CartItem, Order, User, Address, Payment.

4. Frontend Routes (React Router) — recommended paths

Public

/ — Home

/category/:slug — Category listing

/search — Search results (query param q)

/product/:slug — Product detail

/about, /contact, /privacy, /terms, /returns — Static pages

Auth & User

/auth/login, /auth/register, /auth/forgot

/account — Profile

/account/addresses

/account/orders

/account/orders/:id

Cart & Checkout

/cart

/checkout

/order-confirmation/:id

Admin (protected)

/admin/login

/admin — Dashboard

/admin/products

/admin/products/new

/admin/products/:id

/admin/orders

/admin/orders/:id

/admin/inventory

/admin/coupons

/admin/settings

Delivery

/delivery/login

/delivery/orders

/delivery/order/:id

5. Backend API endpoints (Express routes) — grouped by service

Provide RESTful endpoints, JSON responses, use Authorization: Bearer <token> for protected routes. Validation via Joi.

Auth Service — /api/auth

POST /auth/register — body: {name,email,phone,password} → 201 { user, accessToken, refreshToken }

POST /auth/login — {emailOrPhone,password} → { accessToken, refreshToken }

POST /auth/refresh — { refreshToken } → { accessToken }

POST /auth/logout — invalidate refresh

POST /auth/request-otp — { phone } → { otpSent }

POST /auth/verify-otp — { phone, otp } → issue tokens

Product & Category Service — /api/products & /api/categories

GET /products — query: {q,category,brand,priceMin,priceMax,sort,page,limit} → {items,total}

GET /products/:id — product details

POST /products (admin) — create product

PUT /products/:id (admin) — update

DELETE /products/:id (admin)

POST /products/import (admin) — CSV import

GET /products/:id/variants — list variants for product

Category endpoints (product-category pairing & routing)

GET /categories — list all categories (supports ?include=subcategories=true)

Response: [{ id, name, slug, parentId, image, description, order }]

GET /categories/:id — get single category (with children and productCount)

GET /categories/slug/:slug — get category by slug (used by frontend route /category/:slug)

POST /categories (admin) — create category

Body: { name, slug?, parentId?, image?, description?, order? }

PUT /categories/:id (admin) — update category

DELETE /categories/:id (admin) — delete category (soft delete recommended)

Category ↔ Product pairing notes:

Each product has a categoryId (primary) and optional categoryIds[] for multi-category tagging.

Frontend product-listing route uses GET /products?category=<slug|id> which resolves slug to id via /categories/slug/:slug on the backend if needed.

Breadcrumbs are built from category parent chain: /categories/:id returns ancestors array for easy breadcrumbs.

Inventory Service — /api/inventory

GET /inventory/sku/:sku — {sku,stock}

POST /inventory/adjust (admin) — {sku,qty,type,note}

POST /inventory/reserve — {orderId,items[]} → reserves stock

POST /inventory/commit — {orderId} → commit reserved

POST /inventory/release — {orderId} → release reservation — /api/inventory

GET /inventory/sku/:sku — {sku,stock}

POST /inventory/adjust (admin) — {sku,qty,type,note}

POST /inventory/reserve — {orderId,items[]} → reserves stock

POST /inventory/commit — {orderId} → commit reserved

POST /inventory/release — {orderId} → release reservation

Cart & Order Service — /api/orders

GET /cart (user) — {items,totals}

POST /cart — add/update item

DELETE /cart/:sku — remove

POST /orders — checkout: {addressId,paymentMethod,couponCode,items} → creates order, calls inventory.reserve, returns orderId & paymentIntent

GET /orders/:id — order detail

GET /orders — user orders or admin with filters

POST /orders/:id/cancel — cancel order

POST /orders/:id/confirm-delivery — {otp}

Payment Service — /api/payments

POST /payments/initiate — {orderId,gateway,returnUrl} → redirect or payment token

POST /payments/webhook/:gateway — gateway posts here → verify signature → update payment + order. (eSewa & Khalti webhook handlers)

POST /payments/:id/refund — admin

GET /payments/reconcile — admin view of unmatched txns

Notification Service — /api/notify

POST /notify — internal: {userId,type,payload}

GET /notifications — user notifications

PUT /notifications/:id/read — mark read

Admin Service — /api/admin

GET /dashboard — KPIs

GET /reports/sales — query params

POST /admin/products/bulk — CSV

Other admin-only endpoints mapped to services above

Delivery Service — /api/delivery

POST /delivery/login

GET /delivery/orders — assigned to delivery user

POST /delivery/orders/:id/status — update with OTP check