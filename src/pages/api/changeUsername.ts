import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { currentUsername, newUsername } = req.body;

    if (!currentUsername || !newUsername) {
        return res.status(400).json({ message:  'Missing required query parameters currentUsername or newUsername'  });
    }

    try {
        await connectToDatabase();

        const isNewUsernameTaken = await User.findOne({ username: newUsername });

        if (isNewUsernameTaken) return res.status(409).json({
            message: 'The new username is taken. Please use another'
        });

        const currentUser = await User.findOne({ username: currentUsername });

        if (newUsername === currentUser.username) return res.status(409).json({
            message: 'The new username cannot be the same as the current username'
        });

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newUser = await User.findOne({ username: newUsername });

        if (newUser) {
            return res.status(409).json({ message: 'New username already in use' });
        }

        currentUser.username = newUsername;
        await currentUser.save();

        res.status(200).json({ message: 'Username changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}