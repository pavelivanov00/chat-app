"use client"
import { useEffect, useState } from 'react';
import { parse } from 'cookie';
import SendRequest from "./friendsOperations/sendRequest";
import PendingRequests from './friendsOperations/pendingRequests';
import FriendsComponent from "./friendsOperations/friendsComponent";
import ChatWindow from './chatWindow';
import { LeftContainerContent } from "./friendsOperations/enumLeftContainer";
import { RightContainerContent } from "./enumRightContainer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../lib/fontawesome';
import "./home.css";

export default function Home() {
    const [user, setUser] = useState<{ email: string; username: string }>();
    const [numberOfMessages, setNumberOfMessages] = useState<number>(0);

    const [leftContainerContent, setLeftContainerContent] =
        useState<LeftContainerContent>(LeftContainerContent.friends);

    const [rightContainerContent, setRightContainerContent] =
        useState<RightContainerContent>(RightContainerContent.greet);

    const [chatWindowFriend, setChatWindowFriend] = useState<string | null>(null);

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
                console.log(user.username + "'s last online updated")
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
                        className="friendButton colorBlue borderLeftNone"
                        onClick={() => setLeftContainerContent(LeftContainerContent.friends)}
                    >
                        <FontAwesomeIcon icon="fa-solid fa-user-group" />
                    </button>
                    <button
                        className="friendButton colorGreen"
                        onClick={() => setLeftContainerContent(LeftContainerContent.sendRequest)}
                    >
                        <FontAwesomeIcon icon="fa-solid fa-user-plus" />
                    </button>
                    <button
                        className="friendButton"
                        onClick={() => setLeftContainerContent(LeftContainerContent.pending)}
                    >
                        <FontAwesomeIcon icon="fa-solid fa-hourglass-half" />
                    </button>
                    <button className="friendButton colorRed borderRightNone">
                        <FontAwesomeIcon icon="fa-solid fa-ban" />
                    </button>
                </div>
                <div className="friendsContainer">
                    {leftContainerContent === LeftContainerContent.friends &&
                        <FriendsComponent username={user.username} setContent={setRightContainerContent} 
                        setChatWindowFriend={setChatWindowFriend} />}
                    {leftContainerContent === LeftContainerContent.sendRequest &&
                        <SendRequest requester={user.username} setContent={setLeftContainerContent} />}
                    {leftContainerContent === LeftContainerContent.pending &&
                        <PendingRequests requester={user.username} />}
                </div>
            </div>
            <div className="greetContainer">
                {rightContainerContent === RightContainerContent.greet &&
                    <>
                        <h1>Hi, {user.username}!</h1>
                        <div>You have {numberOfMessages} new messages.</div>
                    </>
                }
                {rightContainerContent === RightContainerContent.chatWindow &&
                    <ChatWindow chatWindowFriend={chatWindowFriend!} />}
            </div>
        </div>
    );
};