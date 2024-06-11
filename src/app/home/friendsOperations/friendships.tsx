"use client"
import { RightContainerContent } from "../enumRightContainer";
import "./css/friendships.css";

type FriendshipsProps = {
    friendships: string[];
    setContent: React.Dispatch<React.SetStateAction<RightContainerContent>>;
    setChatWindowFriend: React.Dispatch<React.SetStateAction<string | null>>; 
};

const Friendships: React.FC<FriendshipsProps> = ({ friendships, setContent, setChatWindowFriend }) => {

    const setContentAndFriend = (friend: string) => {
        setChatWindowFriend(friend);
        setContent(RightContainerContent.chatWindow);
    }

    return (
        <>
            {friendships.length !== 0 &&
                <div className="friendships">
                    <div className="friendsLabel">Friends:</div>
                    {friendships.map((name, index) => (
                        <button
                            key={index}
                            className="friend"
                            onClick={() => setContentAndFriend(name)}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            }
        </>
    );
}

export default Friendships;
