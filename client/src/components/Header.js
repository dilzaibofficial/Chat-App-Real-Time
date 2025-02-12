import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ userId, handleLogout }) => {
    const navigate = useNavigate();

    const handleProfile = () => {
        navigate('/profile');
    };

    const handleFriendRequests = () => {
        navigate('/friend-requests');
    };

    const handleHome = () => {
        navigate('/chat');
    };

    const handleAddFriend = () => {
        navigate('/add-friend');
    };

    const handleLogoutClick = () => {
        handleLogout();
        navigate('/'); // Navigate to login page
    };

    return (
        <div className="header">
            <button onClick={handleHome}>Home</button>
            <button onClick={handleProfile}>Profile</button>
            <button onClick={handleFriendRequests}>Friend Requests</button>
            <button onClick={handleAddFriend}>Add Friend</button>
            <button onClick={handleLogoutClick}>Logout</button>
        </div>
    );
};

export default Header;