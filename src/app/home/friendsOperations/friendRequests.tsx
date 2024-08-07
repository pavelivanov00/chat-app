"use client"
import { ObjectId } from "mongoose";
import React from "react";
import "./css/friendRequests.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

type FriendRequestsProps = {
    friendRequests: FriendRequest[];
    onAcceptRequest: (requesterID: ObjectId) => void;
    onCancelRequest: (requesterID: ObjectId) => void;
};

type FriendRequest = {
    requestID: ObjectId;
    requesterUsername: string;
    requesterID: ObjectId;
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
                            key={request.requestID.toString()}
                            style={{
                                borderTop: '2px solid rgb(95, 97, 97)',
                                borderBottom: index === friendRequests.length - 1 ? '2px solid rgb(95, 97, 97)' : 'none'
                            }}
                        >
                            <div className="friendRequest">
                                {/* {request.requester.length > 14 ? request.requester.substring(0, 14) + "..." : request.requester} */}
                                {request.requesterUsername}
                            </div>
                            <div className="friendRequestButtons">
                                <button
                                    className="acceptButton"
                                    onClick={() => onAcceptRequest(request.requesterID!)}
                                >
                                    <FontAwesomeIcon icon={faCheck} />
                                </button>
                                <button
                                    className="cancelButton"
                                    onClick={() => onCancelRequest(request.requesterID!)}
                                >
                                     <FontAwesomeIcon icon={faXmark} />
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
