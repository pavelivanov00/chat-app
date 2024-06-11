"use client"

type ChatWindowProps = {
    chatWindowFriend: string;
};

const ChatWindow: React.FC<ChatWindowProps> = ({ chatWindowFriend }) => {
    return (
        <>
            {chatWindowFriend}
            <div>Chat history renders here</div>
        </>
    );
}

export default ChatWindow;
