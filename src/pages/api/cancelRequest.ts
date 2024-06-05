import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import FriendRequest from '../../models/FriendRequest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { requester, id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Can not find id' });
    }

    try {
        await connectToDatabase();

        const requests = await FriendRequest.deleteOne({ requester: requester, status: 'pending', _id: id });

        res.status(200).json({ message: 'Request canceled' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
