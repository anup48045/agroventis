# 🌾 AgroMitra - Agricultural Marketplace

A dual-platform agricultural marketplace that connects farmers directly with buyers, built with Next.js and React.js. Designed for high rural adoption with offline capabilities and multi-language support.

## 🚀 Features

### For Farmers
- **Mobile-First Design**: Optimized for smartphones and low-end devices
- **Offline Capable**: Works without internet connection
- **Multi-Language Support**: 12+ Indian languages
- **Simple Interface**: Easy to use for rural users
- **Direct Connections**: Connect with buyers without middlemen
- **Real-Time Notifications**: Get alerts for new buyer requirements

### For Buyers
- **Desktop & Mobile**: Accessible on any device
- **Quality Listings**: Verified farmer profiles and products
- **Direct Messaging**: Communicate directly with farmers
- **Secure Transactions**: Safe and transparent dealings
- **Location-Based**: Find farmers in your region

### Technical Features
- **PWA Support**: Install as a mobile app
- **Offline Sync**: Queue actions when offline, sync when online
- **Real-Time Updates**: Live notifications and messaging
- **Responsive Design**: Works on all screen sizes
- **Low Bandwidth**: Optimized for slow internet connections

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, SQLite Database
- **Authentication**: JWT tokens
- **Real-Time**: Socket.io
- **Offline**: Service Worker, IndexedDB
- **Deployment**: Vercel (recommended)

## 📱 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd agro_mitra
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```env
JWT_SECRET=your-secret-key-here
DATABASE_URL=file:./database/agromitra.db
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
agro_mitra/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── farmer/         # Farmer platform
│   │   ├── buyer/          # Buyer platform
│   │   └── globals.css     # Global styles
│   ├── components/         # Reusable components
│   │   ├── farmer/         # Farmer components
│   │   └── buyer/          # Buyer components
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.js  # Authentication
│   │   └── LanguageContext.js # Internationalization
│   ├── lib/                # Utility libraries
│   │   └── database.js     # Database connection
│   └── utils/              # Helper functions
├── public/                 # Static files
│   ├── manifest.json       # PWA manifest
│   ├── sw.js              # Service worker
│   └── icons/             # App icons
├── database/              # Database files
└── README.md
```

## 🌐 Language Support

Currently supports:
- English (en)
- Hindi (hi)
- Bengali (bn)
- Telugu (te)
- Marathi (mr)
- Gujarati (gu)
- Tamil (ta)
- Kannada (kn)
- Malayalam (ml)
- Punjabi (pa)
- Odia (or)
- Assamese (as)

## 📱 PWA Features

### Installation
1. Open the app in Chrome/Safari on mobile
2. Tap "Add to Home Screen"
3. The app will be installed as a native app

### Offline Features
- Browse cached listings
- Queue actions when offline
- Auto-sync when connection restored
- View saved data

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products` - Get all products and categories

### Listings
- `GET /api/buyer-listings` - Get buyer requirements
- `POST /api/buyer-listings` - Create buyer listing
- `GET /api/farmer-listings` - Get farmer listings
- `POST /api/farmer-listings` - Create farmer listing

### Connections
- `GET /api/connections` - Get user connections
- `POST /api/connections` - Create connection
- `PUT /api/connections/:id` - Update connection status

### Messages
- `GET /api/messages/:connectionId` - Get messages
- `POST /api/messages` - Send message

## 🗄️ Database Schema

### Tables
- `users` - Farmer and buyer accounts
- `products` - Product catalog
- `categories` - Product categories
- `buyer_listings` - Buyer requirements
- `farmer_listings` - Farmer offerings
- `connections` - Matches between farmers and buyers
- `messages` - Communication between users
- `sync_queue` - Offline action queue

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically

### Other Platforms
The app can be deployed on any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean
- Railway

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@agromitra.in
- Phone: +91-XXXX-XXXX-XXXX

## 🌟 Impact

AgroMitra aims to:
- Eliminate middlemen in agriculture
- Increase farmer income
- Provide better prices to buyers
- Promote digital literacy in rural areas
- Support local languages and culture

## 📊 Statistics

- 📱 Mobile-first design for rural adoption
- 🌐 12+ Indian languages supported
- 📵 Works completely offline
- 🔄 Auto-sync when online
- 💾 Low data usage
- 🎯 Simple UI/UX for all users

---

Made with ❤️ for Indian farmers and rural communities
