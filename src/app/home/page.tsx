"use client"
import { useEffect, useState } from 'react';
import { parse } from 'cookie';
import "./home.css";

export default function Home() {
    const [user, setUser] = useState<{ email: string; username: string }>();
    const [numberOfMessages, setNumberOfMessages] = useState<number>(0);
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
                    <button className="friendButton addFriendButton">Add a friend</button>
                    <button className="friendButton">Pending</button>
                    <button className="friendButton">Blocked</button>
                </div>
                <div className="friendsContainer">friends render here</div>
            </div>
            <div className="greetContainer">
                <h1>Hi, {user.username}!</h1>
                <div>You have {numberOfMessages} new messages.</div>
            </div>
        </div>
    );
};
