"use client"
import "../css/friendships.css";

type FriendshipsProps = {
    friendships: string[];
};

const Friendships: React.FC<FriendshipsProps> = ({ friendships }) => {
    return (
        <>
            {friendships.length !== 0 &&
                <div className="friendships">
                    <div className="friendsLabel">Friends:</div>
                    {friendships.map((name, index) => (
                        <button
                            key={index}
                            className="friend"
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
