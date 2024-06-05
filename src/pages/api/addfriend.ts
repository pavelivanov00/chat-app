import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import User from '../../models/User';
import FriendRequest from '../../models/FriendRequest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    const { username, friendUsername } = req.body;

    if (!username || !friendUsername) {
        return res.status(400).json({ message: 'Requester and recipent are required' });
    }
    if (username === friendUsername) {
        return res.status(400).json({ message: "You can't add yourself" });
    }
    try {
        await connectToDatabase();
        const requester = await User.findOne({ username });
        const recipient = await User.findOne({ username: friendUsername });

        if (!requester || !recipient) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingRequest = await FriendRequest.findOne({ requester: username, recipient: friendUsername });

        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }

        const friendRequest = new FriendRequest({
            requester: username,
            recipient: friendUsername,
            status: 'pending'
        });

        await friendRequest.save();

        res.status(200).json({ message: 'Friend request sent' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
