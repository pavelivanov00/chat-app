import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import User from '../../models/User';
import FriendRequest from '../../models/FriendRequest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    const { requesterID, recipient } = req.body;

    if (!requesterID || !recipient) {
        return res.status(400).json({ message: 'Missing required query parameters requesterID or recipient' });
    }

    try {
        await connectToDatabase();

        const existingRecipient = await User.findOne({ username: recipient });

        if (!existingRecipient) {
            return res.status(404).json({ message: 'User not found' });
        }

        const recipientID = existingRecipient._id;

        if (requesterID == recipientID) {
            return res.status(400).json({ message: "You can't add yourself" });
        }

        const existingRequest = await FriendRequest.findOne(
            {
                $or: [
                    {
                        requesterID: requesterID,
                        recipientID: recipientID,
                        status: "pending"
                    },
                    {
                        requesterID: requesterID,
                        recipientID: recipientID,
                        status: "accepted"
                    },
                    {
                        requesterID: recipientID,
                        recipientID: requesterID,
                        status: "pending"
                    },
                    {
                        requesterID: recipientID,
                        recipientID: requesterID,
                        status: "accepted"
                    }
                ]
            }
        );
        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }

        const friendRequest = new FriendRequest({
            requesterID: requesterID,
            recipientID: recipientID,
            status: 'pending'
        });
        await friendRequest.save();

        res.status(200).json({ message: 'Friend request sent' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
