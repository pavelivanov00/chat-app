import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, oldPassword, newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ message: 'Missing required query parameters username, newPassword or oldPassword' });
    }

    try {
        await connectToDatabase();

        const currentUser = await User.findOne({ username: username });

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (currentUser.password !== oldPassword) return res.status(401).json({ message: 'The old password is incorrect' });

        currentUser.password = newPassword;
        await currentUser.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}