import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import Message from '../../models/Message';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await connectToDatabase();

    const { sender, receiver } = req.query;

    if (!sender || !receiver) {
        return res.status(400).json({ message: 'Missing required query parameters' });
    }

    try {
        const messages = await Message.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
            ]
        }).sort({ timestamp: 1 });

        return res.status(200).json({ messages });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error'});
    }
}
