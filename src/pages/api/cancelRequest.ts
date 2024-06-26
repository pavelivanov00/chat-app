import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import FriendRequest from '../../models/FriendRequest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { recipientID, requesterID } = req.body;

    if (!recipientID || !requesterID) {
        return res.status(400).json({ message: 'Missing required query parameters recipientID or requesterID' });
    }

    try {
        await connectToDatabase();

        const updateRequest = await FriendRequest.updateOne(
            {
                recipientID: recipientID,
                requesterID: requesterID,
                status: 'pending',
            },
            {
                $set: { status: 'canceled' }
            }
        );

        if (updateRequest.modifiedCount === 0) {
            throw new Error('Friend request not found or already canceled.');
        }

        res.status(201).json({ message: 'Friend request canceled' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}