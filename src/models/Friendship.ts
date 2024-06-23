import mongoose from 'mongoose';

const FriendshipSchema = new mongoose.Schema({
  friendship: { type: [mongoose.Schema.Types.ObjectId], required: true },
}, {
  timestamps: true,
});

export default mongoose.models.Friendship || mongoose.model('Friendship', FriendshipSchema);