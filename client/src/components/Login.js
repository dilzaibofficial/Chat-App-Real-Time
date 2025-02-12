import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import custom CSS

const Login = ({ setUser }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            if (response.data.token) {
                const userResponse = await axios.get(`http://localhost:5000/api/users/${response.data.userId}`);
                const user = userResponse.data;
                setUser(user);
                localStorage.setItem('user', JSON.stringify(user));
                navigate('/chat');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', { username, password });
            if (response.data.message === 'User registered successfully') {
                setIsLogin(true);
                setError('');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>{isLogin ? 'Login' : 'Register'}</h2>
                <form onSubmit={isLogin ? handleLogin : handleRegister}>
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="Logbtn">{isLogin ? 'Login' : 'Register'}</button>
                </form>
                <button className="switch-btn" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Switch to Register' : 'Switch to Login'}
                </button>
            </div>
        </div>
    );
};

export default Login;