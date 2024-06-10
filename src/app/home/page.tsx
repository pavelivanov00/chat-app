"use client"
import { useEffect, useState } from 'react';
import { parse } from 'cookie';
import SendRequest from "./friendsOperations/sendRequest";
import PendingRequests from './friendsOperations/pendingRequests';
import FriendsComponent from "./friendsOperations/friendsComponent";
import { Content } from "./friendsOperations/enum";
import "./css/home.css";

export default function Home() {
    const [user, setUser] = useState<{ email: string; username: string }>();
    const [numberOfMessages, setNumberOfMessages] = useState<number>(0);
    const [leftContainerContent, setLeftContainerContent] = useState<Content>(Content.friends);

    const updateUserLastOnline = async (username: string) => {
        try {
            await fetch('/api/updateLastOnline', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            });
        } catch (error) {
            console.error('Error updating last online time:', error);
        }
    };

    useEffect(() => {
        const cookies = parse(document.cookie);

        if (cookies.user) {
            setUser(JSON.parse(cookies.user));
        }
    }, []);

    useEffect(() => {
        if (user) {
            const intervalId = setInterval(() => {
                updateUserLastOnline(user.username);
                console.log(user.username+"'s last online updated")
            }, 60000);
    
            return () => clearInterval(intervalId);
        }
    }, [user]);

    if (!user) {
        return <div>Please relog...</div>;
    }

    return (
        <div className="outernContainer">
            <div className="leftContainer">
                <div className="friendsFunctions">
                    <button
                        className="friendButton addFriendButton"
                        onClick={() => setLeftContainerContent(Content.sendRequest)}
                    >
                        Add a friend
                    </button>
                    <button
                        className="friendButton"
                        onClick={() => setLeftContainerContent(Content.pending)}
                    >
                        Pending
                    </button>
                    <button className="friendButton">Blocked</button>
                </div>
                <div className="friendsContainer">
                    {leftContainerContent === Content.friends && <FriendsComponent username={user.username} />}
                    {leftContainerContent === Content.sendRequest &&
                        <SendRequest requester={user.username} setContent={setLeftContainerContent} />}
                    {leftContainerContent === Content.pending && <PendingRequests requester={user.username} />}
                </div>
            </div>
            <div className="greetContainer">
                <h1>Hi, {user.username}!</h1>
                <div>You have {numberOfMessages} new messages.</div>
            </div>
        </div>
    );
};