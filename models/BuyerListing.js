import mongoose from 'mongoose';

const buyerListingSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantityRequired: {
    type: Number,
    required: true,
    min: 0
  },
  maxPrice: {
    type: Number,
    required: true,
    min: 0
  },
  qualityRequirements: {
    type: String,
    trim: true
  },
  deliveryLocation: {
    type: String,
    trim: true
  },
  deliveryDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'closed', 'expired'],
    default: 'active'
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
buyerListingSchema.index({ buyerId: 1 });
buyerListingSchema.index({ productId: 1 });
buyerListingSchema.index({ status: 1 });
buyerListingSchema.index({ expiresAt: 1 });

const BuyerListing = mongoose.models.BuyerListing || mongoose.model('BuyerListing', buyerListingSchema);

export default BuyerListing;
