import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import FriendRequest from '../../models/FriendRequest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { requesterID, requestID } = req.body;

    if (!requesterID || !requestID) {
        return res.status(400).json({ message: 'Missing required query parameters requesterID or requestID' });
    }

    try {
        await connectToDatabase();

        const requests = await FriendRequest.deleteOne(
            {
                requesterID: requesterID,
                status: 'pending', _id: requestID
            }
        );

        res.status(200).json({ message: 'Request canceled' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
