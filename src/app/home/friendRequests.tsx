"use client"

import { ObjectId } from "mongoose";
import React, { useState, useEffect, useCallback } from "react";
import "./css/friendRequests.css";

type friendRequestsProps = {
    recipient: string;
}

type friendRequest = {
    requester: string;
    _id: ObjectId
}

const FriendRequests: React.FC<friendRequestsProps> = ({ recipient }) => {
    const [friendRequests, setFriendRequests] = useState<friendRequest[]>([]);

    const fetchFriendRequests = useCallback(async () => {
        try {
            const response = await fetch(`/api/friendRequests?recipient=${recipient}`);
            const data = await response.json();
            if (response.ok) {
                setFriendRequests(data.requests);
            } else {
                console.error("Error fetching requests:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }, [recipient]);

    useEffect(() => {
        fetchFriendRequests();
    }, [fetchFriendRequests]);

    const handleAcceptRequest = async (requester: string) => {
        try {
            const response = await fetch("/api/acceptRequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipient: recipient,
                    requester: requester,
                }),
            });
            const data = await response.json();

            if (response.ok) {
                fetchFriendRequests();
            } else {
                console.error(data.response);
            }
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    };

    return (
        <div className="friendRequestsContainer">
            <div className="friendRequestLabel"> Friend requests:</div>
            {friendRequests.map(request => (
                <div className="friendRequests" key={request._id}>
                    <div className="friendRequest">
                        {request.requester.length > 14 ? request.requester.substring(0, 14) + "..." : request.requester}
                    </div>
                    <button
                        className="acceptButton"
                        onClick={() => handleAcceptRequest(request.requester!)}
                    >
                        Accept
                    </button>
                </div>
            ))}
        </div >
    )
}

export default FriendRequests