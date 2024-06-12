import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import FriendRequest from '../../models/FriendRequest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { recipient } = req.query;

    if (!recipient) {
        return res.status(400).json({ message: 'Can not find username' });
    }

    try {
        await connectToDatabase();

        const requests = await FriendRequest.find({ recipient: recipient, status: 'pending' });

        res.status(200).json({ message: 'Requests queried successfully', requests: requests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
