import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './ChatList.css'; // Import custom CSS

const socket = io('http://localhost:5000');

const ChatList = ({ userId, setFriendId }) => {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/friends/${userId}`);
                const uniqueFriends = response.data.filter((friend, index, self) =>
                    index === self.findIndex((f) => f._id === friend._id)
                );

                // Fetch the profile picture and last message for each friend
                const friendsWithDetails = await Promise.all(uniqueFriends.map(async (friend) => {
                    const [lastMessageResponse, profileResponse] = await Promise.all([
                        axios.get(`http://localhost:5000/api/chat/last-message/${userId}/${friend._id}`),
                        axios.get(`http://localhost:5000/api/profile/${friend._id}`)
                    ]);
                    return {
                        ...friend,
                        lastMessage: lastMessageResponse.data,
                        profilePic: profileResponse.data.profilePic
                    };
                }));

                // Sort friends based on the timestamp of the last message
                friendsWithDetails.sort((a, b) => {
                    if (!a.lastMessage) return 1;
                    if (!b.lastMessage) return -1;
                    return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
                });

                setFriends(friendsWithDetails);
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
    }, [userId]);

    useEffect(() => {
        const handleReceiveMessage = (message) => {
            setFriends((prevFriends) => {
                const updatedFriends = prevFriends.map((friend) => {
                    if (friend._id === message.sender || friend._id === message.receiver) {
                        return { ...friend, lastMessage: message };
                    }
                    return friend;
                });

                // Sort friends based on the timestamp of the last message
                updatedFriends.sort((a, b) => {
                    if (!a.lastMessage) return 1;
                    if (!b.lastMessage) return -1;
                    return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
                });

                return updatedFriends;
            });
        };

        socket.on('receiveMessage', handleReceiveMessage);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
        };
    }, []);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="chat-list">
            <h2>Chat List</h2>
            <ul className="list-group">
                {friends.map((friend) => (
                    <li key={friend._id} className="list-group-item" onClick={() => setFriendId(friend._id)}>
                        <div className="friend-info">
                            <div className="friend-pic">
                                <img src={`http://localhost:5000/uploads/${friend.profilePic}`} alt="Profile" />
                            </div>
                            <div className="friend-details">
                                <span className="friend-username">{friend.username}</span>
                                {friend.lastMessage && (
                                    <span className="last-message">{friend.lastMessage.text}</span>
                                )}
                            </div>
                            {friend.lastMessage && (
                                <span className="last-message-time">
                                    {formatTime(friend.lastMessage.createdAt)}
                                </span>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;