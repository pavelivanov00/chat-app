import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import User from '../../models/User';
import Block from '../../models/Block';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { blockerID } = req.query;

    if (!blockerID) {
        return res.status(400).json({ message: 'Missing required query parameter blockerID' });
    }

    try {
        await connectToDatabase();

        const blocks = await Block.find({ blockerID });

        if (!blocks.length) {
            return res.status(200).json({ message: 'No blocked users found', blockInfo: [] });
        }

        const blockedUsersIDs = blocks.map(block => block.blockedUserID);

        const blockedUsernames = await User.find({ _id: { $in: blockedUsersIDs } }, 'username _id');

        const blockInfo = blocks.map(block => ({
            blockID: block._id,
            blockedUsername: blockedUsernames.find(blockedUser => blockedUser._id.equals(block.blockedUserID))?.username,
        }));
       
        res.status(200).json({ message: 'Blocked users queried successfully', blockInfo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
