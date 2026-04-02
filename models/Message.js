import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Connection',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
   receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  messageText: {
    type: String,
    required: true
  }
}, { timestamps: true });

// 🔥 Index for performance
messageSchema.index({ connectionId: 1, createdAt: 1 });

export default mongoose.models.Message || mongoose.model('Message', messageSchema);