# AgroMitra Setup Guide

## Prerequisites

- Node.js 18.0 or higher
- MongoDB 5.0 or higher
- npm or yarn package manager

## Quick Start

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd agro_mitra
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the project root:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/agromitra

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# App Configuration
NODE_ENV=development
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3001
```

### 3. Database Setup

Make sure MongoDB is running locally:

```bash
# Start MongoDB service
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 4. Seed Database (Optional)

To populate the database with sample data:

```bash
node lib/seedDatabase.js
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3001`

## Project Structure

```
agro_mitra/
├── lib/                    # Utility functions and database connections
│   ├── mongoose.js          # MongoDB connection helper
│   └── seedDatabase.js     # Database seeder
├── models/                  # MongoDB models
│   ├── User.js              # User schema
│   ├── Product.js           # Product schema
│   ├── Category.js          # Category schema
│   ├── BuyerListing.js      # Buyer listings schema
│   └── FarmerListing.js     # Farmer listings schema
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── api/           # API routes
│   │   ├── farmer/         # Farmer platform pages
│   │   └── buyer/          # Buyer platform pages
│   ├── components/          # React components
│   │   ├── layout/         # Layout components (Navbar, Footer)
│   │   ├── landing/        # Landing page components
│   │   ├── farmer/         # Farmer-specific components
│   │   └── buyer/          # Buyer-specific components
│   └── contexts/           # React contexts
├── public/                 # Static assets
└── docs/                  # Documentation
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features

### Landing Page
- 🎨 Beautiful animated crop background
- 📱 Fully responsive design
- 🌐 Multi-language support (12+ Indian languages)
- 🧭 Professional navbar and footer
- 📊 Trust indicators and testimonials

### Farmer Platform
- 👨‍🌾 Product listing management
- 🤝 Direct buyer connections
- 💬 In-app messaging
- 📈 Market insights
- 📱 Mobile-optimized interface

### Buyer Platform
- 🏢 Requirement posting
- 🔍 Farmer discovery
- 📋 Quality verification
- 📦 Order tracking
- 💳 Secure payments

### Technical Features
- 🗄️ MongoDB database with Mongoose ODM
- 🔐 JWT-based authentication
- 📡 RESTful API design
- 🌐 PWA capabilities
- 📱 Offline support
- 🌍 Internationalization ready

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/agromitra` |
| `JWT_SECRET` | JWT signing secret | Required |
| `NODE_ENV` | Environment | `development` |
| `NEXTAUTH_SECRET` | NextAuth secret | Required |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3001` |

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env.local`
   - Verify MongoDB is accessible

2. **Module Import Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Clear Next.js cache: `rm -rf .next`

3. **Port Already in Use**
   - The app will automatically switch to port 3001 if 3000 is occupied
   - Or kill the process using port 3000

4. **Build Errors**
   - Check Node.js version (requires 18.0+)
   - Update dependencies: `npm update`

### Development Tips

- Use `npm run lint` to check for code issues
- The app supports hot reload - changes are reflected automatically
- Database changes require restarting the development server
- Use browser dev tools for debugging API calls

## Production Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secrets
4. Update `NEXTAUTH_URL` to production domain

### Build and Deploy
```bash
npm run build
npm run start
```

## Support

For issues and questions:
- Check the console for detailed error messages
- Verify MongoDB connection and environment variables
- Ensure all dependencies are properly installed
