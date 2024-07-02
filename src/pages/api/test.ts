import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import Block from '../../models/Block';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    return res.status(200).json({ message: 'The back-end works!' });
}
