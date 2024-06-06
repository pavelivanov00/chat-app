import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import FriendRequest from '../../models/FriendRequest';
import Friendship from '../../models/Friendship';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { recipient, requester } = req.body;

    if (!recipient || !requester) {
        return res.status(400).json({ message: 'Something went wrong' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await connectToDatabase();

        const updateRequest = await FriendRequest.updateOne(
            {
                recipient: recipient,
                requester: requester,
                status: 'pending',
            },
            {
                $set: { status: 'accepted' }
            }
        ).session(session);

        if (updateRequest.modifiedCount === 0) {
            throw new Error('Friend request not found or already accepted.');
        }

        const existingFriendship = await Friendship.findOne({
            $or: [
                { friendship: [recipient, requester] },
                { friendship: [requester, recipient] }
            ]
        }).session(session);

        if (existingFriendship) {
            throw new Error('Users are already friends.');
        }

        const newFriendship = new Friendship({ friendship: [requester, recipient] });
        await newFriendship.save({ session });

        await session.commitTransaction();

        res.status(201).json({ message: 'Friendship created successfully' });
    } catch (error) {
        console.error(error);
        await session.abortTransaction();
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        session.endSession();
    }
}