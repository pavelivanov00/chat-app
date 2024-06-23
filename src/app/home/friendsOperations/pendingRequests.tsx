"use client";
import React, { useEffect, useState, useCallback } from "react";
import { ObjectId } from "mongoose";
import "./css/pendingRequests.css";

type PendingRequestsProps = {
  requester: string;
  userID: ObjectId;
};

type Request = {
  recipientUsername?: string;
  requestID?: ObjectId;
};

const PendingRequests: React.FC<PendingRequestsProps> = ({ requester, userID }) => {
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);

  const fetchPendingRequests = useCallback(async () => {
    try {
      const response = await fetch(`/api/pendingRequests?requesterID=${userID}`);
      const data = await response.json();
      if (response.ok) {
        setPendingRequests(data.requestIDsAndUsername);
      } else {
        console.error("Error fetching requests:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [requester]);

  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  const handleCancelOwnRequest = async (requestID: ObjectId) => {
    try {
      const response = await fetch("/api/cancelOwnRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requesterID: userID,
          requestID: requestID,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        fetchPendingRequests();
      } else {
        console.error(data.response);
      }
    } catch (error) {
      console.error("Error while canceling request:", error);
    }
  };

  return (
    <>
      {(pendingRequests.length !== 0) ?
        <>
          <>Pending Requests:</>
          <div className="pendingRequestsContainer">
            {pendingRequests.map(request => (
              <div className="pendingRequest" key={request.requestID!.toString()}>
                <div>{request.recipientUsername}</div>
                <button
                  className="cancelRequest"
                  onClick={() => handleCancelOwnRequest(request.requestID!)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </>
        :
        <>No pending requests</>
      }
    </>
  );
};

export default PendingRequests;