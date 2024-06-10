"use client"
import "../css/friendships.css";

type FriendshipsProps = {
    friendships: string[];
};

const Friendships: React.FC<FriendshipsProps> = ({ friendships }) => {
    return (
        <div className="friendships">
            <div className="friendsLabel">Friends:</div>
            {friendships.map((friendship, index) => (
                <div key={index} className="friend">
                    {friendship}
                </div>
            ))}
        </div>
    );
}

export default Friendships;
