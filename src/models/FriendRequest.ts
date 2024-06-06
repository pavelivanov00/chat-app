import mongoose from 'mongoose';

const FriendRequestSchema = new mongoose.Schema({
  requester: { type: String, required: true },
  recipient: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { collection: 'friend requests' });

export default mongoose.models.FriendRequest || mongoose.model('FriendRequest', FriendRequestSchema);