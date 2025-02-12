import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faBell, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css'; // Import custom CSS

const Navbar = ({ userId, handleLogout }) => {
    const navigate = useNavigate();

    const handleHome = () => {
        navigate('/chat');
    };

    const handleFriendRequests = () => {
        navigate('/friend-requests');
    };

    const handleAddFriend = () => {
        navigate('/add-friend');
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    const handleLogoutClick = () => {
        handleLogout();
        navigate('/'); // Navigate to login page
    };

    return (
        <div className="navbar">
            <button onClick={handleHome}>
                <FontAwesomeIcon icon={faComments} />
            </button>
            <button onClick={handleFriendRequests}>
                <FontAwesomeIcon icon={faBell} />
            </button>
            <button onClick={handleAddFriend}>
                <FontAwesomeIcon icon={faUser} />
            </button>
            <div className="navbar-bottom">
                <button onClick={handleProfile}>
                    <FontAwesomeIcon icon={faUser} />
                </button>
                <button onClick={handleLogoutClick}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
            </div>
        </div>
    );
};

export default Navbar;