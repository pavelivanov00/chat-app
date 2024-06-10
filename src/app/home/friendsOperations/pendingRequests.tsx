"use client";
import React, { useEffect, useState, useCallback } from "react";
import { ObjectId } from "mongoose";
import "../css/pendingRequests.css";

type PendingRequestsProps = {
  requester: string;
};

type Request = {
  recipient?: string;
  _id?: ObjectId;
};

const PendingRequests: React.FC<PendingRequestsProps> = ({ requester }) => {
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);

  const fetchPendingRequests = useCallback(async () => {
    try {
      const response = await fetch(`/api/pendingRequests?requester=${requester}`);
      const data = await response.json();
      if (response.ok) {
        setPendingRequests(data.requests);
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

  const handleCancelOwnRequest = async (id: ObjectId) => {
    try {
      const response = await fetch("/api/cancelOwnRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requester: requester,
          id: id,
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
      <>Pending Requests:</>
      <div className="pendingRequestsContainer">
        {pendingRequests.map(request => (
          <div className="pendingRequest" key={request._id!.toString()}>
            <div>{request.recipient}</div>
            <button
              className="cancelRequest"
              onClick={() => handleCancelOwnRequest(request._id!)}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default PendingRequests;