import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import Block from '../../models/Block';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { blockID } = req.body;

    if (!blockID) {
        return res.status(400).json({ message: 'Missing required query parameters blockID' });
    }

    try {
        await connectToDatabase();

        const requests = await Block.deleteOne(
            {
                _id: blockID
            }
        );

        res.status(200).json({ message: 'User unblocked' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
