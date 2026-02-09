# Sajha Kirana — Premium E-commerce Project Outline

**Purpose**: This document serves as the architectural blueprint and feature roadmap for the Sajha Kirana platform. It outlines the technology choices, UI specifications, and backend contracts for a production-grade e-commerce application.

---

## 1. Project Overview & Master Stack
Sajha Kirana is a high-performance e-commerce ecosystem integrating modern web technologies with advanced AI capabilities.

- **Frontend**: React 19 (TypeScript), Tailwind CSS v4, Redux Toolkit, Framer Motion.
- **Backend**: Node.js, Express (TypeScript), Prisma ORM, MySQL.
- **AI Services**: LangGraph (Orchestration), Qdrant (Vector DB), Groq/OpenAI (LLM).
- **Real-time**: Socket.IO, Redis.
- **Payments**: eSewa, Khalti, COD.

### Implementation Priorities:
1. **Visual Excellence (Current Focus)**: Premium UI with glassmorphism, gradients, and micro-animations.
2. **AI Integration**: RAG-based chatbot, semantic search, and intelligent product discovery.
3. **Core Commerce**: Product management, multi-role auth, cart, and secure checkout.
4. **Admin Mastery**: Analytics dashboard, bulk operations, and automated inventory control.

---

## 2. Updated UI & Route Specifications

### Public Website (Premium Experience)
- **Home (`/`)**: High-impact hero with floating stats, trust badges, featured carousels, and category rainbow icons.
- **Deals (`/deals`)**: Dedicated savings center with dynamic discount calculations, animated savings badges, and urgency timers.
- **Products (`/products`)**: Advanced listing with multi-attribute filters, sorting, and responsive grid layouts.
- **Product Detail (`/product/:slug`)**: 360° image galleries, zoom effects, rich descriptions, and related product carousels.
- **Chatbot (`/chatbot`)**: Full-screen AI assistant interface + persistent global floating widget.

### Account & Checkout
- **Auth (`/login`, `/register`)**: Modern, clean entry points with secure JWT-based flows.
- **Cart (`/cart`)**: Real-time summary with glassmorphism effects and quick-add logic.
- **Checkout (`/checkout`)**: Multi-step protected flow with address management and gateway integration.
- **Orders (`/orders`)**: Comprehensive history with live status tracking and receipt generation.

### Admin Dashboard (`/admin`)
- **Dashboard**: KPI tracking via interactive charts (Revenue, Orders, Low Stock).
- **Products**: Lifecycle management with bulk import/export capabilities.
- **Orders**: Centralized command for status updates and payment reconciliation.
- **Customer Service**: AI-assisted ticket management and feedback analysis.

---

## 3. Backend Architecture & API Contracts

### Service Endpoints (`/api/...`)
- **Auth Service**: `/auth` - JWT, Refresh, Password Reset, Profile.
- **Product Service**: `/products` - Search (Text/Voice/Semantic), Deals, Categories, Facets.
- **Inventory Service**: `/inventory` - Stock Reservation Lifecycle (Reserved → Committed → Released).
- **Order Service**: `/orders` - Lifecycle management, Delivery OTP verification.
- **Payment Service**: `/payment` - Gateway initiation and Webhook handlers (eSewa, Khalti).
- **Chatbot Service**: `/chatbot` - LangGraph stateful conversation threads, RAG retrieval.

### Real-time Contracts (Socket.IO)
- `order:status`: Real-time tracking push.
- `inventory:alert`: Low-stock triggers for admin sessions.
- `chat:sync`: Cross-device message synchronization.

---

## 4. Enhanced Data Model Summary (Prisma)
- **User**: Name, Email, Role (Admin/Customer), Address, LastLogin.
- **Product**: Title, Slug, MRP, Price (Discount calculated dynamically), Stock, Tiered Images (JSON).
- **Category**: Hierarchy-based with unique slugs and icon mappings.
- **Order**: Status timeline, Payment reference, Shipping schema (JSON), OTP.
- **AI Analytics**: Search logs, sentiment tracking, and RAG session history.

---

## 5. Development Roadmap
- [x] **Phase 1 (MVP)**: Core auth, basic listing, and manual checkout.
- [x] **Phase 2 (Growth)**: Advanced search, coupons, and initial AI chatbot.
- [x] **Phase 3 (Premium Polish)**: Complete UI overhaul, dedicated Deals page, and LangGraph optimization.
- [ ] **Phase 4 (Scale)**: Multi-warehouse support, automated delivery routing, and predictive analytics.

---

**Note**: This outline is living documentation and should be updated as new architectural decisions are made.