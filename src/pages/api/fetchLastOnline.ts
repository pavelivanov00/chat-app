import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await connectToDatabase();

    const { receiver } = req.query;

    if (!receiver) {
        return res.status(400).json({ message: 'Missing required query parameter receiver' });
    }

    try {
        const result = await User.findOne({ username: receiver });

        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!result.lastOnline) {
            return res.status(204).end();
        }
        console.log(result.lastOnline);
        return res.status(200).json({
            message: 'Last online status queried successfully',
            lastOnline: result.lastOnline
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}
