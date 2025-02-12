import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './Chat.css'; // Import custom CSS

const socket = io('http://localhost:5000');

const Chat = ({ userId, friendId }) => {
    const [messages, setMessages] = useState([]);
    const [currentFriend, setCurrentFriend] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeout = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            if (friendId) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/chat/${userId}/${friendId}`);
                    setMessages(response.data);
                    const friendResponse = await axios.get(`http://localhost:5000/api/users/${friendId}`);
                    setCurrentFriend(friendResponse.data);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            }
        };

        fetchMessages();
    }, [userId, friendId]);

    useEffect(() => {
        if (friendId) {
            socket.emit('joinRoom', { userId, friendId });

            const handleReceiveMessage = (message) => {
                setMessages((prevMessages) => {
                    // Check if the message is already in the state
                    if (!prevMessages.some((msg) => msg._id === message._id)) {
                        return [...prevMessages, message];
                    }
                    return prevMessages;
                });
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            };

            const handleTyping = ({ sender }) => {
                if (sender === friendId) {
                    setIsTyping(true);
                }
            };

            const handleStopTyping = ({ sender }) => {
                if (sender === friendId) {
                    setIsTyping(false);
                }
            };

            socket.on('receiveMessage', handleReceiveMessage);
            socket.on('typing', handleTyping);
            socket.on('stopTyping', handleStopTyping);

            return () => {
                socket.off('receiveMessage', handleReceiveMessage);
                socket.off('typing', handleTyping);
                socket.off('stopTyping', handleStopTyping);
            };
        }
    }, [friendId, userId]);

    useEffect(() => {
        // Scroll to the bottom of the chat messages when the chat is initially loaded
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const message = {
            sender: userId,
            receiver: friendId,
            text: newMessage,
            createdAt: new Date()
        };

        try {
            const response = await axios.post(`http://localhost:5000/api/chat`, message);
            socket.emit('sendMessage', response.data);
            setMessages((prevMessages) => [...prevMessages, response.data]);
            setNewMessage('');
            socket.emit('stopTyping', { sender: userId, receiver: friendId });
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleTyping = () => {
        if (!typing) {
            setTyping(true);
            socket.emit('typing', { sender: userId, receiver: friendId });
        }

        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
            setTyping(false);
            socket.emit('stopTyping', { sender: userId, receiver: friendId });
        }, 3000);
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="chat-box">
            {currentFriend ? (
                <>
                    <div className="chat-header">
                        <img src={`http://localhost:5000/uploads/${currentFriend.profilePic}`} alt="Profile" className="friend-pic" />
                        <h2>{currentFriend.username}</h2>
                    </div>
                    <div className="chat-messages">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.sender === userId ? 'sent' : 'received'}`}>
                                <p>{message.text}</p>
                                <span className="message-time">{formatTime(message.createdAt)}</span>
                            </div>
                        ))}
                        {isTyping && <div className="typing-indicator">Typing...</div>}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="message-form">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleTyping}
                            placeholder="Type a message"
                            className="form-control"
                        />
                        <button type="submit" className="btn btn-primary">Send</button>
                    </form>
                </>
            ) : (
                <div className="no-chat-selected">
                    <h2>Select a friend to start chatting</h2>
                </div>
            )}
        </div>
    );
};

export default Chat;