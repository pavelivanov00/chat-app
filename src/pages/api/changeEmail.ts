import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { oldEmail, newEmail } = req.body;

    if (!oldEmail || !newEmail) {
        return res.status(400).json({ message: 'Missing required query parameters oldEmail or newEmail' });
    }

    try {
        await connectToDatabase();

        const user = await User.findOne({ email: oldEmail });

        if (!user) return res.status(404).json({ message: 'Email not found' });

        if (newEmail === user.email) return res.status(409).json({
            message: 'The new email address cannot be the same as the current email address'
        });

        if (oldEmail !== user.email) return res.status(401).json({ message: 'The old email is incorrect' });

        user.email = newEmail;
        await user.save();

        res.status(200).json({ message: 'Email changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}