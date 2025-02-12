import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Chat from './components/Chat';
import FriendRequest from './components/FriendRequest';
import ChatList from './components/ChatList';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import AddFriend from './components/AddFriend';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [friendId, setFriendId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="App">
        {user && <Navbar userId={user._id} handleLogout={handleLogout} />}
        <div className="main-content">
          {user ? (
            <Routes>
              <Route path="/" element={<ChatList userId={user._id} setFriendId={setFriendId} />} />
              <Route path="/chat" element={<ChatList userId={user._id} setFriendId={setFriendId} />} />
              <Route path="/friend-requests" element={<FriendRequest userId={user._id} />} />
              <Route path="/add-friend" element={<AddFriend userId={user._id} />} />
              <Route path="/profile" element={<Profile userId={user._id} />} />
            </Routes>
          ) : (
            <Login setUser={setUser} />
          )}
          {user && <Chat userId={user._id} friendId={friendId} />}
        </div>
      </div>
    </Router>
  );
}

export default App;