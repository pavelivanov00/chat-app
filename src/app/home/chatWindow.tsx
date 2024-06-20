"use client"
import TextareaAutosize from 'react-textarea-autosize';
import { ChangeEvent, useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./chatWindow.css";

type ChatWindowProps = {
    receiver: string;
    sender: string;
};

const ChatWindow: React.FC<ChatWindowProps> = ({ receiver, sender }) => {
    const [message, setMessage] = useState<string>('');
    const [messageHistory, setMessageHistory] = useState<object[]>([]);
    const [receiverLastOnline, setReceiverLastOnline] = useState<Date>();
    const ws = useRef<WebSocket | null>(null);
    const lastMessageRef = useRef<HTMLDivElement | null>(null);
    const chatHistoryRef = useRef<HTMLDivElement | null>(null);

    const handleChangeMessage = (event: ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    useEffect(() => {
        fetchMessages(receiver, sender);
        fetchLastOnline(receiver);

        ws.current = new WebSocket('ws://localhost:8080');
        ws.current.onopen = () => console.log('WebSocket connected');
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
    }, [receiver, sender]);

    useEffect(() => {
        if (chatHistoryRef.current) {
            setTimeout(() => {
                chatHistoryRef.current!.scrollTop = chatHistoryRef.current!.scrollHeight;
            }, 100);
        }
    }, [receiver]);

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messageHistory]);

    const fetchMessages = async (sender: string, receiver: string) => {
        try {
            const response = await fetch(`/api/fetchMessages?sender=${sender}&receiver=${receiver}`);
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
            const newMessage = { receiver, sender, message, timestamp: new Date() };
            const jsonString = JSON.stringify(newMessage);
            ws.current.send(jsonString);

            setMessageHistory(prevHistory => [...prevHistory, newMessage]);

            try {
                const response = await fetch('/api/sendMessage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: jsonString,
                });
                if (!response.ok) {
                    console.error('Error sending message:', await response.text());
                }
            } catch (error) {
                console.error('Error while sending message:', error);
            }

            setMessage('');
        }
    };

    const fetchLastOnline = async (receiver: string) => {
        try {
            const response = await fetch(`/api/fetchLastOnline?receiver=${receiver}`);
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
        const now = new Date();
        const diffMs = now.getTime() - new Date(lastOnlineDate).getTime();
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        switch (true) {
            case (diffSeconds < 60):
                return "online now";
            case (diffMinutes < 60):
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
                return `${diffMonths} months ago`;
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

    return (
        <>
            <div className="chatWindowFriend">
                {receiver}
                <p className='lastOnlineStatus'>
                    {formatLastOnline(receiverLastOnline!)}
                </p>
            </div>
            <div className="chatWindow">
                <div className="chatHistory" ref={chatHistoryRef}>
                    {messageHistory.map((msg, index) => (
                        <div
                            key={index}
                            className={`chatMessage ${msg.sender === sender ? 'sent' : 'received'}`}
                            ref={index === messageHistory.length - 1 ? lastMessageRef : null}
                        >
                            <div className="messageTimestamp">{formatMessageTimestamp(msg.timestamp)}</div>
                            <div className="messageContent">{msg.message}</div>
                        </div>
                    ))}
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
                        <FontAwesomeIcon icon="fa-solid fa-paper-plane" />
                    </button>
                </div>
            </div>
        </>
    );
}

export default ChatWindow;
