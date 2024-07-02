"use client"
import TextareaAutosize from 'react-textarea-autosize';
import { ChangeEvent, useEffect, useState, useRef, KeyboardEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./chatWindow.css";
import { ObjectId } from 'mongoose';
import { faEllipsisVertical, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

type ChatWindowProps = {
    receiverUsername: string;
    senderUsername: string;
    senderID: ObjectId;
};

type Message = {
    senderID: ObjectId;
    timestamp: Date;
    message: string;
    receiverUsername: string;
    senderUsername: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ receiverUsername, senderUsername, senderID }) => {
    const [message, setMessage] = useState<string>('');
    const [messageHistory, setMessageHistory] = useState<Message[]>([]);
    const [receiverLastOnline, setReceiverLastOnline] = useState<Date>();
    const [showFriendSettings, setShowFriendSettings] = useState<boolean>(false);

    const [canNotSendMessage, setCanNotSendMessage] = useState<string>('');

    const ws = useRef<WebSocket | null>(null);
    const lastMessageRef = useRef<HTMLDivElement | null>(null);

    const handleChangeMessage = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    };

    useEffect(() => {
        fetchMessages(receiverUsername, senderID);
        fetchLastOnline(receiverUsername);

        ws.current = new WebSocket('ws://localhost:8080');
        ws.current.onopen = () => {
            console.log('WebSocket connected');
            ws.current?.send(JSON.stringify({ senderUsername }));
        };
        ws.current.onmessage = (event) => {
            try {
                const receivedMessage = JSON.parse(event.data);
                setMessageHistory(prevHistory => [...prevHistory, receivedMessage]);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        return () => {
            ws.current?.close();
        };
    }, [receiverUsername, senderUsername, senderID]);

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView(true);
        }
    }, [messageHistory]);

    useEffect(() => {
        setCanNotSendMessage('')
    }, [receiverUsername]);

    const fetchMessages = async (receiverUsername: string, senderID: ObjectId) => {
        try {
            const response = await fetch(`/api/fetchMessages?senderID=${senderID}&receiver=${receiverUsername}`);
            const data = await response.json();
            if (response.ok) {
                setMessageHistory(data.messages);
            } else {
                console.error('Error fetching messages:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSendMessage = async () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            const newMessage = {
                receiverUsername,
                senderUsername,
                message,
                senderID,
                timestamp: new Date()
            };
            const jsonString = JSON.stringify(newMessage);
            ws.current.send(jsonString);

            setMessageHistory(prevHistory => [...prevHistory, newMessage]);

            try {
                const response = await fetch('/api/sendMessage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: jsonString,
                });
                const data = await response.json();
                setCanNotSendMessage(data.message);

                if (!response.ok) {
                    console.error('Error sending message:', await response.text());
                }
            } catch (error) {
                console.error('Error while sending message:', error);
            }

            setMessage('');
        }
    };

    const fetchLastOnline = async (receiverUsername: string) => {
        try {
            const response = await fetch(`/api/fetchLastOnline?receiver=${receiverUsername}`);
            const data = await response.json();
            if (response.ok) {
                setReceiverLastOnline(data.lastOnline);
            } else {
                console.error('Error fetching last online status:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const formatLastOnline = (lastOnlineDate: Date): string => {
        if (!lastOnlineDate) return "last online: not available";
        const now = new Date();
        const diffMs = now.getTime() - new Date(lastOnlineDate).getTime();
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        switch (true) {
            case (diffSeconds < 60):
                return "online now";
            case (diffMinutes === 1):
                return `last online: a minute ago`;
            case (diffMinutes > 1 && diffMinutes < 60):
                return `last online: ${diffMinutes} minutes ago`;
            case (diffHours < 24):
                return `last online: ${diffHours} hours ago`;
            default:
                return `last online: ${diffDays} days ago`;
        }
    };

    const formatMessageTimestamp = (timestamp: Date): string => {
        const now = new Date();
        const messageDate = new Date(timestamp);

        const diffMs = now.getTime() - messageDate.getTime();
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        const messageTimestampHours = messageDate.getHours().toString().padStart(2, '0');
        const messageTimestampMinutes = messageDate.getMinutes().toString().padStart(2, '0');

        switch (true) {
            case (diffDays < 1 && now.getDate() === messageDate.getDate()):
                return `Today at ${messageTimestampHours}:${messageTimestampMinutes}`;
            case (diffDays < 2 && (now.getDate() - messageDate.getDate() === 1)):
                return `Yesterday at ${messageTimestampHours}:${messageTimestampMinutes}`;
            case (diffDays < 30):
                return `${diffDays} days ago`;
            case (diffDays < 365):
                const diffMonths = Math.floor(diffDays / 30);
                if (diffMonths === 1) return `a month ago`;
                if (diffMonths > 1) return `${diffMonths} months ago`;
            default:
                const diffYears = Math.floor(diffDays / 365);
                return `${diffYears} years ago`;
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const handleBlockUser = async () => {
        try {
            const response = await fetch("/api/blockUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    blockerID: senderID,
                    userToBeBlocked: receiverUsername,
                })
            });
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error("Error while canceling request:", error);
        }
    }

    return (
        <>
            <div className="friendContainer">
                <div className="friendFlexbox">
                    <>{receiverUsername}</>
                    <div className='lastOnlineStatus'>
                        {formatLastOnline(receiverLastOnline!)}
                    </div>
                </div>

                <div className='settingsFlexbox'>
                    <button
                        className="friendSettings"
                        onClick={() => setShowFriendSettings(prevState => !prevState)}
                    >
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                    </button>
                    {showFriendSettings &&
                        <>
                            <button
                                className='blockUser'
                                onClick={handleBlockUser}
                            >
                                Block
                            </button>
                        </>
                    }
                </div>

            </div>
            <div className="chatWindow">
                <div className="chatHistory">
                    {messageHistory.map((msg, index) => (
                        <div
                            key={index}
                            className={`chatMessage ${msg.senderID === senderID ? 'sent' : 'received'}`}
                            ref={index === messageHistory.length - 1 ? lastMessageRef : null}
                        >
                            <div className="messageTimestamp">{formatMessageTimestamp(msg.timestamp)}</div>
                            <div className="messageContent">{msg.message}</div>
                        </div>
                    ))}
                    {canNotSendMessage === 'The message could not be sent at this time' &&
                        <div className="canNotSendMessage">
                            The message could not be sent at this time
                        </div>
                    }
                </div>
                <div className="messageContainer">
                    <TextareaAutosize
                        className="messageInput"
                        placeholder="Type your message here"
                        minRows={1}
                        maxRows={10}
                        onChange={handleChangeMessage}
                        onKeyDown={handleKeyDown}
                        value={message}
                    />
                    <button className="sendMessageButton" onClick={handleSendMessage}>
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            </div>
        </>
    );
}

export default ChatWindow;
