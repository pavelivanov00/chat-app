import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import User from '../../models/User';
import FriendRequest from '../../models/FriendRequest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userID } = req.query;

    if (!userID) {
        return res.status(400).json({ message: 'Missing required query parameter userID' });
    }

    try {
        await connectToDatabase();

        const requests = await FriendRequest.find({ recipientID: userID, status: 'pending' });

        if (!requests.length) {
            return res.status(200).json({ message: 'No pending requests found', requestIDAndRequesterInfo: [] });
        }

        const requesterIDs = requests.map(request => request.requesterID);

        const users = await User.find({ _id: { $in: requesterIDs } }, 'username _id');

        const requestIDAndRequesterInfo = requests.map(request => ({
            requestID: request._id,
            requesterUsername: users.find(user => user._id.equals(request.requesterID))?.username,
            requesterID: request.requesterID,
        }));

        res.status(200).json({ message: 'Requests queried successfully', requestIDAndRequesterInfo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
