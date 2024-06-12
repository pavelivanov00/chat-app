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
        return res.status(400).json({ message: 'Missing required query parameters' });
    }

    try {
        const result = await User.find({ username: receiver });
        console.log(result[0].lastOnline);
        return res.status(200).json({
            message: 'Last online status queried successfully',
            lastOnline: result[0].lastOnline
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}
