"use client"
import React, { useEffect, useState, useCallback } from "react";
import Friendships from "./friendships";
import FriendRequests from "./friendRequests";
import { ObjectId } from "mongoose";

type FriendsContainerProps = {
    username: string
}

type FriendRequest = {
    requester: string;
    _id: ObjectId;
}

const FriendsContainer: React.FC<FriendsContainerProps> = ({ username }) => {
    const [friendships, setFriendships] = useState<string[]>([]);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

    const fetchFriendships = useCallback(async () => {
        try {
            const response = await fetch(`/api/friendships?name=${username}`);
            const data = await response.json();
            if (response.ok) {
                setFriendships(data.friends);
            } else {
                console.error("Error fetching friendships:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }, [username]);

    const fetchFriendRequests = useCallback(async () => {
        try {
            const response = await fetch(`/api/friendRequests?recipient=${username}`);
            const data = await response.json();
            if (response.ok) {
                setFriendRequests(data.requests);
            } else {
                console.error("Error fetching requests:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }, [username]);

    useEffect(() => {
        fetchFriendships();
        fetchFriendRequests();
    }, [fetchFriendships, fetchFriendRequests]);

    const handleAcceptRequest = async (requester: string) => {
        try {
            const response = await fetch("/api/acceptRequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipient: username,
                    requester: requester,
                }),
            });
            const data = await response.json();

            if (response.ok) {
                fetchFriendRequests();
                fetchFriendships();
            } else {
                console.error(data.response);
            }
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    };

    return (
        <>
            <FriendRequests 
                friendRequests={friendRequests} 
                onAcceptRequest={handleAcceptRequest} 
            />
            <Friendships friendships={friendships} />
        </>
    );
}

export default FriendsContainer;
