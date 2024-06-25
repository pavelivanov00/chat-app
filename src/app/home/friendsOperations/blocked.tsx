"use client";
import React, { useEffect, useState, useCallback } from "react";
import { ObjectId } from "mongoose";
import "./css/blocked.css";

type BlockedProps = {
    blockerID: ObjectId;
};

type Block = {
    blockID?: ObjectId,
    blockedUsername?: string;
    blockerID?: ObjectId;
};

const Blocked: React.FC<BlockedProps> = ({ blockerID }) => {
    const [blockedUsers, setBlockedUsers] = useState<Block[]>([]);

    const fetchBlockedUsers = useCallback(async () => {
        try {
            const response = await fetch(`/api/fetchBlockedUsers?blockerID=${blockerID}`);
            const data = await response.json();
            if (response.ok) {
                setBlockedUsers(data.blockInfo);
            } else {
                console.error("Error fetching blocked users:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }, [blockerID]);

    useEffect(() => {
        fetchBlockedUsers();
    }, [fetchBlockedUsers]);

      const handleUnblockUser = async (blockID: ObjectId) => {
        try {
          const response = await fetch("/api/unblockUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              blockID,
            }),
          });
          const data = await response.json();

          if (response.ok) {
            fetchBlockedUsers();
          } else {
            console.error(data.response);
          }
        } catch (error) {
          console.error("Error while unblocking user:", error);
        }
      };

    return (
        <>
            {(blockedUsers.length !== 0) ?
                <>
                    <>Blocked users:</>
                    <div className="">
                        {blockedUsers.map(block => (
                            <div className="blockFlexbox" key={block.blockID!.toString()}>
                                <div>{block.blockedUsername}</div>
                                <button
                                    className="cancelBlock"
                                    onClick={() => handleUnblockUser(block.blockID!)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </>
                :
                <>No blocked users</>
            }
        </>
    );
};

export default Blocked;