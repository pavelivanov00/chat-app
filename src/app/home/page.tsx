"use client"
import { useEffect, useState } from 'react';
import { parse } from 'cookie';
import SendRequest from "./sendRequest";
import PendingRequests from './pendingRequests';
import FriendRequests from './friendRequests';
import "./css/home.css";

export default function Home() {
    const [user, setUser] = useState<{ email: string; username: string }>();
    const [numberOfMessages, setNumberOfMessages] = useState<number>(0);

    enum Content {
        friends = "friends",
        addFriend = "add a friend",
        pending = "pending requests",
        blocked = "blocked users"
    }

    const [leftContainerContent, setLeftContainerContent] = useState<Content>(Content.friends);
    useEffect(() => {
        const cookies = parse(document.cookie);

        if (cookies.user) {
            setUser(JSON.parse(cookies.user));
        }
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="outernContainer">
            <div className="leftContainer">
                <div className="friendsFunctions">
                    <button
                        className="friendButton addFriendButton"
                        onClick={() => setLeftContainerContent(Content.addFriend)}
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
                    {leftContainerContent === Content.friends && <FriendRequests recipient={user.username} />}
                    {leftContainerContent === Content.addFriend && <SendRequest requester={user.username} />}
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
