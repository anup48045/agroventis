import mongoose from 'mongoose';

const farmerListingSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantityAvailable: {
    type: Number,
    required: true,
    min: 0
  },
  askingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  qualityDescription: {
    type: String,
    trim: true
  },
  harvestDate: {
    type: Date
  },
  location: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'expired'],
    default: 'available'
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
farmerListingSchema.index({ farmerId: 1 });
farmerListingSchema.index({ productId: 1 });
farmerListingSchema.index({ status: 1 });
farmerListingSchema.index({ expiresAt: 1 });

const FarmerListing = mongoose.models.FarmerListing || mongoose.model('FarmerListing', farmerListingSchema);

export default FarmerListing;
