# Sajha Kirana - Complete E-commerce Platform

**साझा किराना** (Sajha Kirana) is a comprehensive e-commerce platform built for grocery shopping and retail businesses. The platform features a modern React frontend with a robust Node.js backend, providing a full shopping experience from product browsing to order fulfillment.

## 🏗️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling with custom design system
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Framer Motion** for smooth animations
- **Lucide React** for icons
- **Socket.io Client** for real-time features

### Backend
- **Node.js** with Express and TypeScript
- **Prisma ORM** with MySQL database
- **JWT** for authentication
- **Socket.io** for real-time communication
- **Multer** for file uploads
- **Nodemailer** for email notifications
- **Joi** for request validation

### Payment Integration
- **eSewa** payment gateway
- **Khalti** payment gateway
- Webhook handling for payment verification

## 🚀 Features

### 👤 User Features

#### Authentication & User Management
- User registration and login
- Email verification system
- Profile management with photo upload
- Role-based access (Customer/Admin)

#### Shopping Experience
- **Advanced Search**: Text search with autocomplete, voice search, image search
- **Categorization**: Browse by categories and subcategories
- **Product Details**: Rich product descriptions, image galleries, variants
- **Shopping Cart**: Add/remove items, quantity management, cart persistence
- **Checkout Process**: Multiple delivery options, address management
- **Order Tracking**: Real-time order status updates
- **Product Reviews**: Rate and review purchased products

#### Account Management
- Order history and tracking
- Profile editing
- Address book for multiple delivery addresses

### 🛍️ E-commerce Features

#### Product Management
- Product catalog with images, descriptions, pricing
- Category-based organization
- SKU-based inventory tracking
- MRP (Market Retail Price) with discount calculations
- Product variants and attributes

#### Search & Discovery
- **Advanced Search**: Multi-field search with filters
- **Voice Search**: Speech-to-text product search
- **Image Search**: Visual product search with machine learning
- **Autocomplete**: Real-time search suggestions
- **Filters**: Price range, category, availability filters
- **Sorting**: Newest, price high/low, popularity

#### Shopping Cart
- Persistent cart across sessions
- Quantity adjustments
- Item removal and wishlist alternatives
- Automatic price calculations
- Minimum order validation

### 📱 Admin Dashboard

#### Product Management
- CRUD operations for products
- Bulk import via CSV
- Image upload and management
- Category assignment
- SEO optimization fields

#### Inventory Management
- Real-time stock tracking
- Stock reservation system
- Low stock alerts
- Inventory adjustments
- Reservation lifecycle (reserved → committed → released)

#### Order Management
- Order overview and details
- Status updates (pending → processing → shipped → delivered)
- Payment reconciliation
- Delivery tracking with OTP verification
- Order cancellation and refunds

#### User Management
- Customer list and details
- Admin user creation
- User activity monitoring
- Profile management

#### Marketing & Promotions
- **Coupon System**: Percentage and fixed amount discounts
- Usage limits and expiration dates
- Minimum order values
- Automatic coupon validation

#### Analytics & Reporting
- Sales statistics and trends
- Top products and categories
- Revenue tracking
- Customer analytics
- Performance metrics

### 🔧 Technical Features

#### Real-time Updates
- Order status notifications
- Low inventory alerts
- Live chat support (extensible)
- Real-time dashboard updates

#### File Management
- Product image galleries
- Category images
- User profile pictures
- Automatic image optimization
- Cloud storage support (configurable)

#### Payment Processing
- Secure payment gateway integration
- Multiple payment options
- Transaction verification
- Automatic reconciliation
- Refund processing

#### API Architecture
- RESTful API design
- Comprehensive validation
- Error handling and logging
- Rate limiting and security
- API documentation (extensible)

## 🗂️ Project Structure

```
sajha-kirana/
├── frontend/                 # React application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/         # Basic UI components (Button, Modal, etc.)
│   │   │   ├── Auth/       # Authentication components
│   │   │   ├── AdminDashboard/  # Admin interface components
│   │   │   └── Publicwebsite/   # Public site components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── Redux/          # State management
│   │   ├── routes/         # Route definitions
│   │   └── types/          # TypeScript type definitions
│   └── package.json
├── backend/                 # Express server
│   ├── src/
│   │   ├── controllers/    # Business logic controllers
│   │   ├── routes/        # API route definitions
│   │   ├── middlewares/   # Express middlewares
│   │   ├── validators/    # Request validation schemas
│   │   ├── utils/         # Utility functions
│   │   ├── config/        # Configuration files
│   │   └── server.ts      # Server entry point
│   ├── prisma/            # Database schema and migrations
│   ├── uploads/           # File upload directories
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rahultharu064/SajhaKirana.git
   cd sajha-kirana
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install

   # Configure environment variables
   cp .env.example .env
   # Edit .env with your database credentials and API keys

   # Setup database
   npm run prisma:generate
   npm run prisma:db:push

   # Seed admin user (optional)
   npm run seed:admin

   # Start development server
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install

   # Configure environment variables (if needed)
   cp .env.example .env

   # Start development server
   npm run dev
   ```

### Environment Configuration

#### Backend (.env)
```env
DATABASE_URL="mysql://user:password@localhost:sajha_kirana"
JWT_SECRET="your-super-secret-jwt-key"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Payment Gateway Keys
ESEWA_SECRET_KEY="your-esewa-secret"
ESEWA_MERCHANT_CODE="your-merchant-code"
KHALTI_SECRET_KEY="your-khalti-secret"
KHALTI_PUBLIC_KEY="your-khalti-public"

# Other configurations
PORT=3000
```

#### Frontend (.env)
```env
VITE_API_BASE_URL="http://localhost:3000/api"
VITE_SOCKET_URL="http://localhost:3000"
```

## 🗄️ Database Schema

The platform uses MySQL with Prisma ORM. Key entities include:

- **User**: Customer and admin accounts
- **Product**: Items for sale with variants
- **Category**: Product categorization
- **CartItem**: Shopping cart contents
- **Order/OrderItem**: Purchase transactions
- **Payment**: Payment records
- **Review**: Customer feedback
- **Coupon**: Discount codes
- **Inventory**: Stock management
- **Reservation**: Stock reservation system

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh

### Products & Categories
- `GET /api/products` - List products with filters
- `GET /api/products/:slug` - Product details
- `GET /api/categories` - List categories
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)

### Shopping Cart & Orders
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add/update cart item
- `POST /api/orders` - Create order
- `GET /api/orders` - List user's orders
- `GET /api/orders/:id` - Order details

### Payments
- `POST /api/payments/initiate` - Initialize payment
- `POST /api/payments/webhook/:gateway` - Payment webhook

### Admin Operations
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/products` - Product management
- `GET /api/admin/orders` - Order management
- `GET /api/admin/users` - User management
- `GET /api/admin/inventory` - Inventory management

## 🔒 Security Features

- **Authentication**: JWT-based with refresh tokens
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive Joi schemas
- **Rate Limiting**: API protection
- **File Upload Security**: Type and size validation
- **Database Security**: Parameterized queries with Prisma
- **Password Hashing**: bcrypt with salt rounds

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach with responsive breakpoints
- Touch-optimized interfaces
- Progressive enhancement for older browsers

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility

### Performance
- Code splitting and lazy loading
- Image optimization
- Caching strategies
- Bundle size optimization

## 🔄 Real-time Features

- **Order Updates**: Live order status tracking
- **Inventory Alerts**: Low stock notifications
- **Live Chat**: Customer support integration (extensible)
- **Admin Notifications**: Real-time dashboard updates

## 📦 Deployment

### Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

### Docker Support
The application is container-ready and can be deployed with Docker for consistent environments across development and production.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for the Nepali market with local payment gateways
- Focus on performance, security, and user experience
- Extensible architecture for future enhancements

---

**Note**: This is a production-ready e-commerce platform with comprehensive features for grocery and retail businesses. The code is well-structured, documented, and follows industry best practices.
