import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import connectToDatabase from '../../lib/mongoose';
import User from '../../models/User';
import FriendRequest from '../../models/FriendRequest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { requesterID } = req.query;

    if (!requesterID) {
        return res.status(400).json({ message: 'Missing required query parameter requesterID' });
    }

    try {
        await connectToDatabase();

        const requests = await FriendRequest.find({ requesterID: requesterID, status: 'pending' });

        if (!requests.length) {
            return res.status(200).json({ message: 'No pending requests', requestIDsAndUsername: [] })
        }

        const recipientIDs = requests.map(request => request.recipientID);

        const users = await User.find({ _id: { $in: recipientIDs } }, 'username _id');

        const requestIDsAndUsername = requests.map(request => ({
            requestID: request._id,
            recipientUsername: users.find(user => user._id.equals(request.recipientID))?.username
        }));

        res.status(200).json({ message: 'Requests queried successfully', requestIDsAndUsername });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
