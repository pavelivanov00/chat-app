"use client"
import React, { ChangeEvent, useState } from "react";
import "./css/sendRequest.css";

type sendRequestProps = {
    requester: string
}

const SendRequest: React.FC<sendRequestProps> = ({ requester }) => {
    const [recipient, setRecipient] = useState<string>('');
    const [responseMessage, setResponseMessage] = useState('');
    const [responseStatus, setResponseStatus] = useState('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;
        setRecipient(name);
    };

    const handleAddFriend = async () => {
        try {
            const response = await fetch('/api/sendRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requester: requester,
                    recipient: recipient
                })
            });

            const data = await response.json();

            if (response.ok) {
                setResponseMessage(data.message);
                setResponseStatus('success');
            } else {
                setResponseMessage(data.message);
                setResponseStatus('error');
            };
        } catch (error) {
            console.error('Error while adding friend:', error);
        }
    }
    return (
        <>
            <>Enter your friend's username:</>
            <div className="addFriendContainer">
                <input
                    type="text"
                    name="friendUsername"
                    className="friendUsername"
                    onChange={handleChange}
                >
                </input>
                <button
                    className="addFriend"
                    onClick={() => handleAddFriend()}
                >
                    Add friend
                </button>
            </div>
            <div style={{ color: responseStatus === "success" ? "rgb(4, 182, 4)" : "rgb(238, 125, 125)", marginTop: "0.5rem" }}>
                {responseMessage}
            </div>
        </>
    )
}

export default SendRequest;