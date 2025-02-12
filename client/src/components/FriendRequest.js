import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FriendRequest.css'; // Import custom CSS

const FriendRequest = ({ userId }) => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/friends/requests/${userId}`);
                setFriendRequests(response.data);
            } catch (error) {
                console.error('Error fetching friend requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriendRequests();
    }, [userId]);

    const handleAcceptRequest = async (requestId) => {
        try {
            await axios.post(`http://localhost:5000/api/friends/accept`, { userId, requestId });
            setFriendRequests(friendRequests.filter(req => req._id !== requestId));
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleDeclineRequest = async (requestId) => {
        try {
            await axios.post(`http://localhost:5000/api/friends/decline`, { userId, requestId });
            setFriendRequests(friendRequests.filter(req => req._id !== requestId));
        } catch (error) {
            console.error('Error declining friend request:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="friend-requests">
            <h2>Friend Requests</h2>
            {friendRequests.length === 0 ? (
                <p>No friend requests</p>
            ) : (
                <ul>
                    {friendRequests.map(request => (
                        <li key={request._id}>
                            {request.username}
                            <button onClick={() => handleAcceptRequest(request._id)}>Accept</button>
                            <button onClick={() => handleDeclineRequest(request._id)}>Decline</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FriendRequest;