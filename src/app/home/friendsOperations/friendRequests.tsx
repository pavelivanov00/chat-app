"use client"
import { ObjectId } from "mongoose";
import React from "react";
import "./css/friendRequests.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type FriendRequestsProps = {
    friendRequests: FriendRequest[];
    onAcceptRequest: (requester: string) => void;
    onCancelRequest: (requester: string) => void;
};

type FriendRequest = {
    requester: string;
    _id: ObjectId;
}

const FriendRequests: React.FC<FriendRequestsProps> = ({ friendRequests, onAcceptRequest, onCancelRequest }) => {
    return (
        <>
            {friendRequests.length !== 0 &&
                <div className="friendRequestsContainer">
                    <div className="friendRequestLabel"> Friend requests:</div>
                    {friendRequests.map((request, index) => (
                        <div
                            className="friendRequests"
                            key={request._id.toString()}
                            style={{
                                borderTop: '2px solid rgb(95, 97, 97)',
                                borderBottom: index === friendRequests.length - 1 ? '2px solid rgb(95, 97, 97)' : 'none'
                            }}
                        >
                            <div className="friendRequest">
                                {/* {request.requester.length > 14 ? request.requester.substring(0, 14) + "..." : request.requester} */}
                                {request.requester}
                            </div>
                            <div className="friendRequestButtons">
                                <button
                                    className="acceptButton"
                                    onClick={() => onAcceptRequest(request.requester!)}
                                >
                                    <FontAwesomeIcon icon="fa-solid fa-check" />
                                </button>
                                <button
                                    className="cancelButton"
                                    onClick={() => onCancelRequest(request.requester!)}
                                >
                                     <FontAwesomeIcon icon="fa-solid fa-xmark" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div >
            }
        </>
    )
}

export default FriendRequests;
