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

    return (
        <>
            <div className="chatWindowFriend">
                {receiver}
                <p className='lastOnlineStatus'>last online: {new Date(receiverLastOnline).toLocaleString()}</p>
            </div>
            <div className="chatWindow">
                <div className="chatHistory">
                    {messageHistory.map((msg, index) => (
                        <div key={index} className={`chatMessage ${msg.sender === sender ? 'sent' : 'received'}`}>
                            <div className="messageContent">{msg.message}</div>
                            <div className="messageTimestamp">{new Date(msg.timestamp).toLocaleString()}</div>
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
