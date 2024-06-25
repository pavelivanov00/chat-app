import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import User from '../../models/User';
import Block from '../../models/Block';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    const { blockerID, userToBeBlocked } = req.body;

    if (!blockerID || !userToBeBlocked) {
        return res.status(400).json({ message: 'Missing required query parameters blockerID or userToBeBlocked' });
    }

    try {
        await connectToDatabase();

        const existingUser = await User.findOne({ username: userToBeBlocked });

        if (!existingUser) {
            return res.status(404).json({ message: 'User not found. Please relog' });
        }

        const userToBeBlockedID = existingUser._id;

        if (blockerID == userToBeBlockedID) {
            return res.status(400).json({ message: "You can't block yourself" });
        }

        const existingBlock = await Block.findOne(
            {
                blockedUserID: userToBeBlockedID,
                blockerID: blockerID,
            }
        );
        if (existingBlock) {
            return res.status(400).json({ message: 'User already blocked' });
        }

        const friendRequest = new Block({
            blockedUserID: userToBeBlockedID,
            blockerID: blockerID,
        });
        await friendRequest.save();

        res.status(200).json({ message: 'User was blocked' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
