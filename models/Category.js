import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameLocalized: {
    type: Map,
    of: String,
    default: new Map()
  },
  icon: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
categorySchema.index({ name: 1 });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category;
