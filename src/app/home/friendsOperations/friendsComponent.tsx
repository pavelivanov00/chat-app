"use client"
import React, { useEffect, useState, useCallback } from "react";
import Friendships from "./friendships";
import FriendRequests from "./friendRequests";
import { ObjectId } from "mongoose";
import { RightContainerContent } from "../enumRightContainer";

type FriendsComponentProps = {
    username: string;
    setContent: React.Dispatch<React.SetStateAction<RightContainerContent>>; 
    setChatWindowFriend: React.Dispatch<React.SetStateAction<string | null>>; 
}

type FriendRequest = {
    requester: string;
    _id: ObjectId;
}

const FriendsComponent: React.FC<FriendsComponentProps> = ({ username, setContent, setChatWindowFriend }) => {
    const [friendships, setFriendships] = useState<string[]>([]);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

    const fetchFriendships = useCallback(async () => {
        try {
            const response = await fetch(`/api/fetchFriendships?name=${username}`);
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
            const response = await fetch(`/api/fetchFriendRequests?recipient=${username}`);
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

    const handleCancelRequest = async (requester: string) => {
        try {
            const response = await fetch("/api/cancelRequest", {
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
            console.error("Error cenceling request:", error);
        }
    };

    return (
        <>
            <FriendRequests 
                friendRequests={friendRequests} 
                onAcceptRequest={handleAcceptRequest}
                onCancelRequest={handleCancelRequest}  
            />
            <Friendships friendships={friendships} setContent={setContent} setChatWindowFriend={setChatWindowFriend} />
        </>
    );
}

export default FriendsComponent;
