import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import Friendship from '../../models/Friendship';
import mongoose from 'mongoose';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userID } = req.query;

    if (!userID || typeof userID !== 'string') {
        return res.status(400).json({ message:  'Missing required query parameter userID' });
    }

    try {
        await connectToDatabase();

        const friendships = await Friendship.find({
            friendship: userID
        }).exec();

        const friendsIDs = friendships.flatMap((friendship: any) => {
            return friendship.friendship.filter((friend: mongoose.Types.ObjectId) => !friend.equals(userID));
        });

        const friendsQuery = await User.find({ _id: friendsIDs });
        const friendsUsernames = friendsQuery.map(friend => friend.username);
        
        console.log(friendsUsernames);
        res.status(200).json({ friendsUsernames });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
