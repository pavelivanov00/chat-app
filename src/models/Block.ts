import mongoose from 'mongoose';

const BlockSchema = new mongoose.Schema({
    blockedUserID: { type: mongoose.Schema.Types.ObjectId, required: true },
    blockerID: { type: mongoose.Schema.Types.ObjectId, required: true },
}, {
  timestamps: true,
});

export default mongoose.models.Block || mongoose.model('Block', BlockSchema);