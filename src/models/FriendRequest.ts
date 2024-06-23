import mongoose from 'mongoose';

const FriendRequestSchema = new mongoose.Schema({
  requesterID: { type: mongoose.Schema.Types.ObjectId, required: true },
  recipientID: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'canceled'], default: 'pending' },
}, { collection: 'friend requests' });

export default mongoose.models.FriendRequest || mongoose.model('FriendRequest', FriendRequestSchema);