import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationBox = ({ userId }) => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/friends/requests/${userId}`);
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching friend requests:', error);
            }
        };

        fetchRequests();
    }, [userId]);

    const handleAccept = async (requestId) => {
        try {
            await axios.post(`http://localhost:5000/api/friends/accept`, { userId, requestId });
            setRequests(requests.filter(request => request._id !== requestId));
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleDecline = async (requestId) => {
        try {
            await axios.post(`http://localhost:5000/api/friends/decline`, { userId, requestId });
            setRequests(requests.filter(request => request._id !== requestId));
        } catch (error) {
            console.error('Error declining friend request:', error);
        }
    };

    return (
        <div className="notification-box">
            <h2>Friend Requests</h2>
            {requests.length === 0 ? (
                <p>No new friend requests</p>
            ) : (
                requests.map(request => (
                    <div key={request._id} className="friend-request">
                        <p>{request.username}</p>
                        <button onClick={() => handleAccept(request._id)}>Accept</button>
                        <button onClick={() => handleDecline(request._id)}>Decline</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default NotificationBox;