"use client"
import TextareaAutosize from 'react-textarea-autosize';
import { ChangeEvent, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./chatWindow.css";

type ChatWindowProps = {
    receiver: string;
    sender: string;
};

const ChatWindow: React.FC<ChatWindowProps> = ({ receiver, sender }) => {
    const [message, setMessage] = useState<string>('');
    const [messageHistory, setMessageHistory] = useState<object[]>([]);

    const handleChangeMessage = (event: ChangeEvent<HTMLInputElement>) => {
        const string = event.target.value;
        setMessage(string);
    };

    useEffect(() => {
        fetchMessages(receiver, sender);
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
        try {
            const response = await fetch('/api/sendMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    receiver: receiver,
                    sender: sender,
                    message: message
                })
            });
            if (response.ok) {
                fetchMessages(receiver, sender);
                setMessage('');
            }
        } catch (error) {
            console.error('Error while sending message:', error);
        }
    };

    const [receiverLastOnline, setReceiverLastOnline] = useState<Date>();

    useEffect(() => {
        fetchLastOnline(receiver);
    }, [receiver]);

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
                <p>last online: {new Date(receiverLastOnline).toLocaleString()}</p>
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
                    <button
                        className="sendMessageButton"
                        onClick={() => handleSendMessage()}
                    >
                        <FontAwesomeIcon icon="fa-solid fa-paper-plane" />
                    </button>
                </div>
            </div>
        </>
    );
}

export default ChatWindow;
