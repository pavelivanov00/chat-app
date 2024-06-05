"use client"
import { ChangeEvent, useState } from "react";
import "./addFriend.css";
import React from "react";

type addFriendProps = {
    username: string
}

const AddFriend: React.FC<addFriendProps> = ({ username }) => {
    const [friendUsername, setFriendUsername] = useState<string>('');
    const [responseMessage, setResponseMessage] = useState('');
    const [responseStatus, setResponseStatus] = useState('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;
        setFriendUsername(name);
    };

    const handleAddFriend = async () => {
        try {
            const response = await fetch('/api/addFriend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    friendUsername: friendUsername
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

export default AddFriend;