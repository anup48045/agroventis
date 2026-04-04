import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false  // Make password optional for Firebase users
  },
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true  // Allow multiple null values
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  userType: {
    type: String,
    required: true,
    enum: ['farmer', 'buyer']
  },
  location: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  district: {
    type: String,
    trim: true
  },
  village: {
    type: String,
    trim: true
  },
  pincode: {
    type: String,
    trim: true
  },
  languagePreference: {
    type: String,
    default: 'en'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  company: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
// userSchema.index({ phone: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ state: 1 });
userSchema.index({ district: 1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
