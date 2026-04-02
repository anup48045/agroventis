import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema(
  {
  
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

   
    buyerListingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BuyerListing',
      required: true
    },
    farmerListingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FarmerListing',
      required: true
    },

   
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },

   
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending'
    },

    
    negotiatedPrice: {
      type: Number
    },
    finalQuantity: {
      type: Number
    },

    
    lastMessage: {
      type: String
    }

  },
  {
    timestamps: true 
  }
);

connectionSchema.index({ farmerId: 1, status: 1 });
connectionSchema.index({ buyerId: 1, status: 1 });

export default mongoose.models.Connection ||
  mongoose.model('Connection', connectionSchema);