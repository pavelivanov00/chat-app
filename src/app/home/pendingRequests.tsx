"use client"
import React, { useEffect, useState } from "react";

type pendingRequestsProps = {
    username: string
}

type request = {
    recipient?: string
}

const PendingRequests: React.FC<pendingRequestsProps> = ({ username }) => {
    const [pendingRequests, setPendingRequests] = useState<Array<object>>([]);

    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                const response = await fetch(`/api/pendingRequests?requester=${username}`);
                const data = await response.json();
                if (response.ok) {
                    console.log('Pending requests:', data.requests);
                    setPendingRequests(data.requests);
                } else {
                    console.error('Error fetching requests:', data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchPendingRequests();
    }, [username]);
    return (
        <>
            <div>Pending Requests</div>
            <div>
                {pendingRequests.map((request: request, index: number) => (
                    <div key={index}>{request.recipient}</div>
                ))}
            </div>
        </>
    )
}

export default PendingRequests;