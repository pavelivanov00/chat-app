import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import Friendship from '../../models/Friendship';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ message: 'Something went wrong' });
    }

    try {
        await connectToDatabase();

        const friendships = await Friendship.find({
            friendship: name
        }).exec();

        const friends = friendships.flatMap((friendship: any) => {
            return friendship.friendship.filter((friend: string) => friend !== name);
        });

        res.status(200).json({ friends });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
