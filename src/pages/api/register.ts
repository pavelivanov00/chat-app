import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
