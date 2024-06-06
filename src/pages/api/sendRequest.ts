import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import User from '../../models/User';
import FriendRequest from '../../models/FriendRequest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    const { requester, recipient } = req.body;

    if (!requester || !recipient) {
        return res.status(400).json({ message: 'Requester and recipient are required' });
    }
    if (requester === recipient) {
        return res.status(400).json({ message: "You can't add yourself" });
    }
    try {
        await connectToDatabase();

        const existingRecipient = await User.findOne({ username: recipient });
        if (!existingRecipient) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingRequest = await FriendRequest.findOne(
            {
                $or: [
                    {
                        requester: requester,
                        recipient: recipient,
                        status: "pending"
                    },
                    {
                        requester: requester,
                        recipient: recipient,
                        status: "accepted"
                    },
                    {
                        requester: recipient,
                        recipient: requester,
                        status: "pending"
                    },
                    {
                        requester: recipient,
                        recipient: requester,
                        status: "accepted"
                    }
                ]
            }
        );
        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }

        const friendRequest = new FriendRequest({
            requester: requester,
            recipient: recipient,
            status: 'pending'
        });
        await friendRequest.save();

        res.status(200).json({ message: 'Friend request sent' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
