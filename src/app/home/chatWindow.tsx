"use client"
import TextareaAutosize from 'react-textarea-autosize';
import { ChangeEvent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./chatWindow.css";

type ChatWindowProps = {
    chatWindowFriend: string;
};

const ChatWindow: React.FC<ChatWindowProps> = ({ chatWindowFriend }) => {
    const [message, setMessage] = useState<string>('');

    const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const string = event.target.value;
        setMessage(string);
    };

    const handleSubmit = () => {
        console.log(message);
        setMessage('');
    };

    return (
        <>
            <div className="chatWindowFriend">{chatWindowFriend}</div>
            <div className="chatWindow">
                <div className="chatHistory">Chat history renders here</div>
                <form onSubmit={handleSubmit} className="textAreaForm">
                    <TextareaAutosize
                        className="messageInput"
                        placeholder="Type your message here"
                        minRows={1}
                        maxRows={10}
                        onChange={handleMessageChange}
                    />
                    <button type="submit" className="sendMessageButton">
                        <FontAwesomeIcon icon="fa-solid fa-paper-plane" />
                    </button>
                </form>
            </div>
        </>
    );
}

export default ChatWindow;
