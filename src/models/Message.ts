import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    senderID: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiverID: { type: mongoose.Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, required: true }
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
