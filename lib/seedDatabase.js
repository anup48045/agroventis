import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

// Sample data
const categories = [
  { name: 'Grains', icon: '🌾', nameLocalized: { hi: 'अनाज', bn: 'শস্য', te: 'ధాన్యాలు' } },
  { name: 'Vegetables', icon: '🥬', nameLocalized: { hi: 'सब्जियां', bn: 'শাকসব্জি', te: 'కూరగాలు' } },
  { name: 'Fruits', icon: '🍎', nameLocalized: { hi: 'फल', bn: 'ফল', te: 'పండ్లు' } },
  { name: 'Spices', icon: '🌶️', nameLocalized: { hi: 'मसाले', bn: 'মসলা', te: 'మసాలాలు' } },
  { name: 'Pulses', icon: '🫘', nameLocalized: { hi: 'दालें', bn: 'ডাল', te: 'పప్పులు' } },
  { name: 'Oilseeds', icon: '🌻', nameLocalized: { hi: 'तेल के बीज', bn: 'তেলবীজ', te: 'నూనెగిడ్లు' } },
  { name: 'Dairy', icon: '🥛', nameLocalized: { hi: 'डेयरी', bn: 'দুগ্ধ', te: 'పాల ఉత్పత్తులు' } },
  { name: 'Flowers', icon: '🌻', nameLocalized: { hi: 'फूल', bn: 'ফুল', te: 'పుష్పాలు' } }
];

const products = [
  { name: 'Wheat', category: 'Grains', unit: 'quintal', basePrice: 2200, description: 'Premium quality wheat', icon: '🌾' },
  { name: 'Rice', category: 'Grains', unit: 'quintal', basePrice: 3000, description: 'Long grain basmati rice', icon: '🌾' },
  { name: 'Tomatoes', category: 'Vegetables', unit: 'kg', basePrice: 40, description: 'Fresh red tomatoes', icon: '🍅' },
  { name: 'Potatoes', category: 'Vegetables', unit: 'kg', basePrice: 25, description: 'Farm fresh potatoes', icon: '🥔' },
  { name: 'Onions', category: 'Vegetables', unit: 'kg', basePrice: 30, description: 'Fresh onions', icon: '🧅' },
  { name: 'Apples', category: 'Fruits', unit: 'kg', basePrice: 120, description: 'Himachal apples', icon: '🍎' },
  { name: 'Mangoes', category: 'Fruits', unit: 'kg', basePrice: 80, description: 'Alphonso mangoes', icon: '🥭' },
  { name: 'Turmeric', category: 'Spices', unit: 'kg', basePrice: 150, description: 'Organic turmeric', icon: '🌶️' },
  { name: 'Chili', category: 'Spices', unit: 'kg', basePrice: 100, description: 'Dry red chilies', icon: '🌶️' },
  { name: 'Lentils', category: 'Pulses', unit: 'kg', basePrice: 80, description: 'Fresh lentils', icon: '🫘' },
  { name: 'Mustard Seeds', category: 'Oilseeds', unit: 'kg', basePrice: 60, description: 'Pure mustard seeds', icon: '🌻' },
  { name: 'Groundnuts', category: 'Oilseeds', unit: 'kg', basePrice: 90, description: 'Fresh groundnuts', icon: '🥜' },
  { name: 'Milk', category: 'Dairy', unit: 'liter', basePrice: 55, description: 'Fresh cow milk', icon: '🥛' },
  { name: 'Curd', category: 'Dairy', unit: 'kg', basePrice: 60, description: 'Fresh curd', icon: '🥛' },
  { name: 'Marigold', category: 'Flowers', unit: 'kg', basePrice: 80, description: 'Fresh marigold flowers', icon: '🌻' },
  { name: 'Jasmine', category: 'Flowers', unit: 'kg', basePrice: 120, description: 'Fresh jasmine flowers', icon: '🌸' }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agromitra');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);

    // Create category map for product insertion
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Insert products with category references
    const productsWithCategoryIds = products.map(product => ({
      ...product,
      category: categoryMap[product.category]
    }));

    const createdProducts = await Product.insertMany(productsWithCategoryIds);
    console.log(`Created ${createdProducts.length} products`);

    console.log('Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeder
// if (require.main === module) {
// }
seedDatabase();

export default seedDatabase;
