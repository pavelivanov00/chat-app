"use client"
import { useEffect, useState } from 'react';
import { parse } from 'cookie';
import SendRequest from "./friendsOperations/sendRequest";
import PendingRequests from './friendsOperations/pendingRequests';
import FriendsComponent from "./friendsOperations/friendsComponent";
import ChatWindow from './chatWindow';
import Settings from "./friendsOperations/settings";
import { LeftContainerContent } from "./friendsOperations/enumLeftContainer";
import { RightContainerContent } from "./enumRightContainer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../lib/fontawesome';
import "./home.css";
import { ObjectId } from 'mongoose';
import Blocked from './friendsOperations/blocked';

type User = {
    email: string;
    username: string;
    userID: ObjectId;
};

export default function Home() {
    const [user, setUser] = useState<User>();
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
            console.log(username + "'s last online updated")
        } catch (error) {
            console.error('Error updating last online time:', error);
        }
    };

    const setUserAndUpdateUserLastOnline = (cookies: any) => {
        const parsedUser = JSON.parse(cookies.user);

        setUser(parsedUser);
        updateUserLastOnline(parsedUser.username);
    }

    useEffect(() => {
        const cookies = parse(document.cookie);

        if (cookies.user) {
            setUserAndUpdateUserLastOnline(cookies);
        }
    }, []);

    useEffect(() => {
        if (user) {
            const intervalId = setInterval(() => {
                updateUserLastOnline(user.username);
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
                        className="friendButton colorGray"
                        onClick={() => setLeftContainerContent(LeftContainerContent.pending)}
                    >
                        <FontAwesomeIcon icon="fa-solid fa-hourglass-half" />
                    </button>
                    <button
                        className="friendButton colorRed"
                        onClick={() => setLeftContainerContent(LeftContainerContent.blocked)}
                    >
                        <FontAwesomeIcon icon="fa-solid fa-ban" />
                    </button>
                    <button
                        className="friendButton colorGray borderRightNone"
                        onClick={() => setLeftContainerContent(LeftContainerContent.settings)}
                    >
                        <FontAwesomeIcon icon="fa-solid fa-gear" />
                    </button>
                </div>
                <div className="friendsContainer">
                    {leftContainerContent === LeftContainerContent.friends &&
                        <FriendsComponent
                            userID={user.userID}
                            username={user.username}
                            setContent={setRightContainerContent}
                            setChatWindowFriend={setChatWindowFriend}
                        />
                    }
                    {leftContainerContent === LeftContainerContent.sendRequest &&
                        <SendRequest
                            requesterID={user.userID}
                            requester={user.username}
                        />
                    }
                    {leftContainerContent === LeftContainerContent.blocked &&
                        <Blocked
                            blockerID={user.userID}
                        />
                    }
                    {leftContainerContent === LeftContainerContent.pending &&
                        <PendingRequests
                            userID={user.userID}
                            requester={user.username}
                        />
                    }
                    {leftContainerContent === LeftContainerContent.settings &&
                        <Settings
                            userID={user.userID}
                            user={user.username}
                        />
                    }
                </div>
            </div>
            <div className="greetContainer">
                {rightContainerContent === RightContainerContent.greet &&
                    <>
                        <h1>Hi, {user.username}!</h1>
                        {/* <div>You have {numberOfMessages} new messages.</div> */}

                    </>
                }
                {rightContainerContent === RightContainerContent.chatWindow &&
                    <ChatWindow
                        receiverUsername={chatWindowFriend!}
                        senderID={user.userID}
                        senderUsername={user.username}
                    />
                }
            </div>
        </div>
    );
};