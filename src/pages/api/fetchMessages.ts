import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import Message from '../../models/Message';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await connectToDatabase();

    const { senderID, receiver } = req.query;

    if (!senderID || !receiver) {
        return res.status(400).json({ message: 'Missing required query parameters senderID or receiver' });
    }

    try {

        const receiverQuery = await User.findOne({ username: receiver }).select('_id');
        const receiverID = receiverQuery ? receiverQuery._id : null;

        const messages = await Message.find({
            $or: [
                { senderID, receiverID },
                { senderID: receiverID, receiverID: senderID }
            ]
        }).sort({ timestamp: 1 });

        return res.status(200).json({ messages });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error'});
    }
}
