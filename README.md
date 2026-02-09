# Sajha Kirana - Premium E-commerce Platform

**साझा किराना** (Sajha Kirana) is a state-of-the-art, full-featured e-commerce platform designed for the modern grocery and retail experience. It combines a **premium, vibrant UI** with high-performance AI services, providing a seamless shopping journey from intelligent product discovery to secure checkout.

## ✨ Premium UI & Visual Excellence
The entire platform has been meticulously crafted with a focus on modern design aesthetics and superior user experience:
- **Vibrant Design System**: A curated color palette using rich HSL gradients (Emerald, Violet, Rose) and sleek dark themes.
- **Glassmorphism**: Subtle blur effects and semi-transparent layers for a modern, high-end feel.
- **Micro-animations**: Smooth transitions, hover-lift effects, and reactive elements powered by **Framer Motion**.
- **Responsive Mastery**: Pixel-perfect layouts optimized for every device, from ultra-wide monitors to the smallest smartphones.
- **Professional Typography**: Using 'Inter' and 'Plus Jakarta Sans' for maximum readability and visual impact.

## 🏗️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for blazing fast development
- **Tailwind CSS v4** with advanced utility-first styling
- **Redux Toolkit** for robust state management
- **Framer Motion** for production-grade animations
- **Lucide React** for consistent, beautiful iconography
- **React Hot Toast** for beautiful, non-intrusive notifications

### Backend
- **Node.js** with Express and TypeScript
- **Prisma ORM** with MySQL database
- **LangGraph** for advanced AI agent orchestration
- **Qdrant** Vector Database for semantic RAG-based search
- **Groq & OpenAI** for ultra-fast LLM responses
- **JWT & Passport** for secure, multi-role authentication
- **Socket.io** for real-time updates and live chat
- **IoRedis** for high-speed caching and session management

## 🚀 Key Features

### 🤖 Sajha Kirana AI Assistant
- **Global AI Widget**: A persistent, intelligent assistant available on every page.
- **Semantic Product Search**: Find products using natural language and intent, not just keywords.
- **Smart Recommendations**: Context-aware product and category suggestions.
- **Animated Interface**: Premium chat window with gradient bubbles and interactive welcome states.

### 🛍️ Shopping Experience
- **Dynamic Deals Center**: Dedicated `/deals` page featuring high-discount products with real-time savings calculations.
- **Interactive Product Cards**: Hover actions, quick-view, star ratings, and animated wishlist toggles.
- **Voice Shopping**: Integrated speech-to-text for hands-free product discovery.
- **Advanced Filtering**: Multi-attribute filtering with real-time results and pagination.
- **Glassy Header**: Sticky navigation with announcement bars, "Hot" badges, and animated cart indicators.

### 📱 Admin Dashboard
- **Comprehensive Analytics**: Visual charts for revenue, orders, and customer trends.
- **Inventory Management**: Real-time stock tracking with a reservation/commitment lifecycle.
- **Marketing Tools**: Coupon generation, promotional banner control, and review moderation.
- **Order Fulfillment**: End-to-end tracking from pending to delivery with secure OTP verification.

## 🗂️ Project Structure

```
sajha-kirana/
├── frontend/                 # React application (Vite-powered)
│   ├── src/
│   │   ├── components/      # UI components (Public, Admin, Chatbot)
│   │   ├── pages/          # Full page views (Home, Deals, Products, etc.)
│   │   ├── services/       # API abstraction layer
│   │   ├── Redux/          # Global state management
│   │   └── routes/         # Dynamic routing system
├── backend/                 # Node.js Express server
│   ├── src/
│   │   ├── controllers/    # Business logic & AI orchestration
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Core services (Database, Vector Search, AI)
│   │   └── prisma/        # Database schema & migrations
└── ...
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+
- MySQL 8.0+
- Qdrant (for AI features)
- Groq/OpenAI API Keys

### Installation & Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/Rahultharu064/SajhaKirana.git
   cd sajha-kirana
   # Install dependencies in both folders
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Environment Configuration**
   - Setup `.env` files in both `backend/` and `frontend/` folders following the provided `.env.example` templates.

3. **Database Initialization**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   npm run seed:admin  # Recommended for first setup
   ```

4. **Run Development Servers**
   ```bash
   # From the root directory:
   # You can use the provided start-servers.bat (Windows) 
   # or run npm run dev in both directories separately.
   ```

## 💳 Payment Gateways
Sajha Kirana is deeply integrated for the Nepali market:
- **eSewa**: Secure mobile wallet and bank-link payments.
- **Khalti**: Modern digital wallet integration.
- **Cash on Delivery**: Traditional and reliable checkout option.

## 📝 License
This project is licensed under the ISC License.

---

**Developed with ❤️ by the Sajha Kirana Team.**  
*A fusion of modern technology and user-centric design.*
