# MERN E-Commerce Website

> **Frontend:** Vite JS (React JS) with Material-UI
> **Backend:** Node JS & Express JS
> **Database:** MongoDB
> **Payment:** Braintree Integration

## 🚀 Features Overview

### 🛍️ **User Features**
- **Product Browsing**: View all products with pagination
- **Product Search**: Search products by name with real-time results
- **Category Filtering**: Filter products by main categories and subcategories
- **Price Range Filtering**: Filter products by price ranges
- **Product Details**: Detailed product view with multiple images
- **Shopping Cart**: Add/remove products, quantity management
- **User Authentication**: Sign up, sign in, sign out
- **User Dashboard**: View profile and order history
- **Responsive Design**: Mobile-friendly interface

### 👨‍💼 **Admin Features**
- **Admin Dashboard**: Comprehensive admin panel
- **Product Management**: Create, read, update, delete products
- **Multiple Image Upload**: Upload multiple images per product
- **Category Management**: Create and manage hierarchical categories
- **Order Management**: View and update order statuses
- **User Management**: Manage user accounts
- **Analytics**: View sales and user statistics

### 🎨 **UI/UX Features**
- **Modern Header**: Professional header with search, cart, and navigation
- **Hero Section**: Sliding banner with call-to-action
- **Responsive Layout**: Works on all device sizes
- **Material-UI Components**: Professional UI components
- **Dark Theme**: Consistent dark blue/grey color scheme
- **Smooth Animations**: Hover effects and transitions

## 📋 Installation Process

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mern-ecommerce-master
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
npm install
```

#### Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Environment Configuration

#### Backend .env File
Create `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
BRAINTREE_MERCHANT_ID=your_braintree_merchant_id
BRAINTREE_PUBLIC_KEY=your_braintree_public_key
BRAINTREE_PRIVATE_KEY=your_braintree_private_key
```

#### Frontend Configuration
Update `frontend/src/config.js`:
```javascript
export const API = 'http://localhost:5000/api';
```

### 4. Database Setup
1. Create MongoDB Atlas account
2. Create a new cluster
3. Get connection string and add to `.env`
4. Database will be automatically created with required collections

### 5. Run the Application
```bash
# From root directory - runs both backend and frontend
npm run dev
```

**Access URLs:**
- Frontend: http://localhost:5173/
- Backend API: http://localhost:5000/api

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  role: Number, // 0 = user, 1 = admin
  salt: String,
  hashed_password: String,
  history: Array,
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: ObjectId,
  subcategory: String,
  subSubcategory: String,
  quantity: Number,
  sold: Number,
  photo: {
    data: Buffer,
    contentType: String
  },
  images: [{
    data: Buffer,
    contentType: String
  }],
  shipping: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Categories Collection
```javascript
{
  _id: ObjectId,
  name: String,
  parent: ObjectId, // For subcategories
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  products: [{
    product: ObjectId,
    count: Number,
    price: Number
  }],
  transaction_id: String,
  amount: Number,
  address: String,
  status: String,
  user: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 Core Functionality

### 🔐 Authentication System
- **JWT-based Authentication**: Secure token-based authentication
- **Role-based Access Control**: Separate user and admin roles
- **Protected Routes**: Secure admin and user-specific pages
- **Session Management**: Persistent login sessions

### 🛒 Shopping Cart System
- **Add to Cart**: Add products with quantity selection
- **Cart Management**: Update quantities, remove items
- **Cart Persistence**: Cart data persists across sessions
- **Cart Validation**: Stock availability checking

### 💳 Payment Integration
- **Braintree Integration**: Secure payment processing
- **Credit Card Processing**: Accept major credit cards
- **Order Management**: Complete order lifecycle management
- **Transaction Tracking**: Unique transaction IDs

### 🔍 Search & Filter System
- **Real-time Search**: Instant product search results
- **Category Filtering**: Filter by main categories
- **Price Range Filtering**: Filter by price ranges
- **Combined Filters**: Multiple filter combinations
- **Search History**: Recent search suggestions

### 📱 Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive tablet layouts
- **Desktop Optimization**: Full desktop experience
- **Touch-Friendly**: Mobile gesture support

## 🎨 UI Components

### Header Components
- **Top Banner**: Social links and account access
- **Main Header**: Logo, search bar, cart, wishlist
- **Navigation Bar**: Main navigation with active states
- **Mobile Menu**: Collapsible mobile navigation

### Product Components
- **Product Cards**: Grid layout with product information
- **Product Details**: Comprehensive product view
- **Image Gallery**: Multiple product images
- **Related Products**: Product recommendations

### Admin Components
- **Admin Dashboard**: Overview of admin functions
- **Product Management**: CRUD operations for products
- **Category Management**: Hierarchical category system
- **Order Management**: Order status tracking
- **User Management**: User account administration

## 🔧 Technical Features

### Backend Features
- **RESTful API**: Clean API endpoints
- **File Upload**: Image upload with Formidable
- **Data Validation**: Input validation and sanitization
- **Error Handling**: Comprehensive error management
- **Security**: Password hashing, JWT tokens

### Frontend Features
- **React Hooks**: Modern React patterns
- **State Management**: Local state with React hooks
- **API Integration**: Axios for HTTP requests
- **Form Handling**: Controlled components
- **Routing**: React Router for navigation

### Performance Features
- **Image Optimization**: Compressed image uploads
- **Lazy Loading**: Optimized component loading
- **Caching**: Browser caching for static assets
- **Pagination**: Efficient data loading

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set:
- MongoDB connection string
- JWT secret key
- Braintree payment credentials

### Production Build
```bash
# Build frontend for production
cd frontend
npm run build

# Start production server
npm start
```

### Database Migration
- Database collections are created automatically
- Sample data can be added through admin panel
- Backup and restore procedures available

## 📊 Admin Panel Features

### Dashboard Overview
- **User Statistics**: Total users, new registrations
- **Product Statistics**: Total products, low stock alerts
- **Order Statistics**: Total orders, revenue tracking
- **Quick Actions**: Direct links to common tasks

### Product Management
- **Add Products**: Create new products with multiple images
- **Edit Products**: Update product information
- **Delete Products**: Remove products with confirmation
- **Bulk Operations**: Mass product updates
- **Stock Management**: Track inventory levels

### Category Management
- **Hierarchical Categories**: Main categories and subcategories
- **Category CRUD**: Create, read, update, delete categories
- **Category Tree**: Visual category hierarchy
- **Product Assignment**: Assign products to categories

### Order Management
- **Order Tracking**: View all orders with status
- **Status Updates**: Change order status (processing, shipped, delivered)
- **Order Details**: Complete order information
- **Customer Communication**: Order status notifications

## 🔒 Security Features

### Authentication Security
- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: Secure session management
- **Route Protection**: Protected admin and user routes
- **Input Validation**: Server-side validation

### Data Security
- **MongoDB Security**: Secure database connections
- **File Upload Security**: Validated file types and sizes
- **XSS Protection**: Input sanitization
- **CSRF Protection**: Cross-site request forgery prevention

## 📱 Mobile Features

### Responsive Design
- **Mobile Navigation**: Collapsible mobile menu
- **Touch Gestures**: Swipe and tap interactions
- **Mobile Cart**: Touch-friendly cart interface
- **Mobile Search**: Optimized search experience

### Performance
- **Fast Loading**: Optimized for mobile networks
- **Offline Support**: Basic offline functionality
- **Progressive Web App**: PWA capabilities
- **Mobile Payments**: Mobile-optimized checkout

## 🎯 Future Enhancements

### Planned Features
- **Wishlist System**: Save favorite products
- **Product Reviews**: Customer review system
- **Email Notifications**: Order and account notifications
- **Advanced Analytics**: Detailed sales analytics
- **Multi-language Support**: Internationalization
- **Social Login**: Google, Facebook login integration

### Technical Improvements
- **Caching Layer**: Redis for improved performance
- **Image CDN**: Cloud-based image delivery
- **API Rate Limiting**: Enhanced API security
- **Database Indexing**: Optimized database queries

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- Follow ESLint configuration
- Use meaningful commit messages
- Write comprehensive tests
- Document new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments
- Contact the development team

---

**Built with ❤️ using MERN Stack**