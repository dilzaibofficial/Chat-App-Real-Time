import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddFriend.css'; // Import custom CSS

const AddFriend = ({ userId }) => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        console.log(`AddFriend component mounted with userId: ${userId}`);
    }, [userId]);

    const handleSendRequest = async (e) => {
        e.preventDefault();
        console.log('Sending Request:', { userId, username });
        try {
            const response = await axios.post(`http://localhost:5000/api/friends/request`, { userId, username });
            setMessage(response.data.message);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Error sending friend request');
            }
            console.error('Error sending friend request:', error);
        }
    };

    return (
        <div className="add-friend">
            <h2>Add New Friend</h2>
            <form onSubmit={handleSendRequest}>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter friend's username"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Send Request</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default AddFriend;