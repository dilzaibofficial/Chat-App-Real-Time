import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'; // Import custom CSS

const Profile = ({ userId }) => {
    const [profilePic, setProfilePic] = useState(null);
    const [preview, setPreview] = useState(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Fetch the current profile picture and username if they exist
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/profile/${userId}`);
                if (response.data.profilePic) {
                    setPreview(`http://localhost:5000/uploads/${response.data.profilePic}`);
                }
                setUsername(response.data.username);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfileData();
    }, [userId]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePic(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!profilePic) return;

        const formData = new FormData();
        formData.append('profilePic', profilePic);

        try {
            const response = await axios.post(`http://localhost:5000/api/profile/upload/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Profile picture uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading profile picture:', error);
        }
    };

    return (
        <div className="profile">
            <h2>Profile</h2>
            <form onSubmit={handleUpload}>
                <div className="profile-pic">
                    {preview ? (
                        <img src={preview} alt="Profile Preview" />
                    ) : (
                        <p>No profile picture</p>
                    )}
                </div>
                <h3>{username}</h3>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button type="submit" className="btn btn-primary">Upload</button>
            </form>
        </div>
    );
};

export default Profile;