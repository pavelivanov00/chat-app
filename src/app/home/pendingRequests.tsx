"use client";
import React, { useEffect, useState, useCallback } from "react";
import "./pendingRequests.css";
import { ObjectId } from "mongoose";

type pendingRequestsProps = {
  username: string;
};

type Request = {
  recipient?: string;
  _id?: ObjectId;
};

const PendingRequests: React.FC<pendingRequestsProps> = ({ username }) => {
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);

  const fetchPendingRequests = useCallback(async () => {
    try {
      const response = await fetch(`/api/pendingRequests?requester=${username}`);
      const data = await response.json();
      if (response.ok) {
        setPendingRequests(data.requests);
      } else {
        console.error("Error fetching requests:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [username]);

  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  const handleCancelRequest = async (id: ObjectId) => {
    try {
      const response = await fetch("/api/cancelRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requester: username,
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
        {pendingRequests.map((request) => (
          <div className="pendingRequest" key={request._id}>
            <div>{request.recipient}</div>
            <button
              className="cancelRequest"
              onClick={() => handleCancelRequest(request._id!)}
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