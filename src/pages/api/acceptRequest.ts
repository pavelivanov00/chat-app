import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import FriendRequest from '../../models/FriendRequest';
import Friendship from '../../models/Friendship';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { recipientID, requesterID } = req.body;

    if (!recipientID || !requesterID) {
        return res.status(400).json({ message: 'Missing required query parameters recipientID or requesterID' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await connectToDatabase();

        const updateRequest = await FriendRequest.updateOne(
            {
                recipientID: recipientID,
                requesterID: requesterID,
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
                { friendship: [recipientID, requesterID] },
                { friendship: [requesterID, recipientID] }
            ]
        }).session(session);

        if (existingFriendship) {
            throw new Error('Users are already friends.');
        }

        const newFriendship = new Friendship({ friendship: [requesterID, recipientID] });
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