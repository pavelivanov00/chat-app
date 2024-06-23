import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import Message from '../../models/Message';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await connectToDatabase();

    const { senderID, receiver, message } = req.body;

    if (!senderID || !receiver || !message) {
        return res.status(400).json({ message: 'Missing required query parameters senderID, receiver or message' });
    }

    try {
        const receiverQuery = await User.findOne({ username: receiver }).select('_id');
        const receiverID = receiverQuery ? receiverQuery._id : null;

        const newMessage = new Message({
            senderID,
            receiverID,
            message
        });

        await newMessage.save();

        return res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error'});
    }
}
