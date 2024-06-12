import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import Message from '../../models/Message';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await connectToDatabase();

    const { sender, receiver, message } = req.body;

    if (!sender || !receiver || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newMessage = new Message({
            sender,
            receiver,
            message
        });

        await newMessage.save();

        return res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error'});
    }
}
