import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import Message from '../../models/Message';
import User from '../../models/User';
import Block from '../../models/Block';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await connectToDatabase();

    const { senderID, receiverUsername, message, timestamp } = req.body;

    if (!senderID || !receiverUsername || !message || !timestamp) {
        return res.status(400).json({
            message: 'Missing required query parameters senderID, receiverUsername, message or timestamp'
        });
    }

    try {
        const receiverQuery = await User.findOne({ username: receiverUsername }).select('_id');
        const receiverID = receiverQuery ? receiverQuery._id : null;

        const isTheUserBlocked = await Block.findOne({
            $or: [
                {
                    $and: [
                        { blockedUserID: receiverID },
                        { blockerID: senderID }
                    ]
                },
                {
                    $and: [
                        { blockedUserID: senderID },
                        { blockerID: receiverID }
                    ]
                }
            ]
        });
        
        if (isTheUserBlocked) return res.status(403).json({
            message: 'The message could not be sent at this time'
        });

        const newMessage = new Message({
            senderID,
            receiverID,
            message,
            timestamp
        });

        await newMessage.save();

        return res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}
