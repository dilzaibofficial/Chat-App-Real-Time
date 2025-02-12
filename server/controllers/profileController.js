const multer = require('multer');
const path = require('path');
const User = require('../models/User'); // Assuming you have a User model

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const filename = `${req.params.userId}${path.extname(file.originalname)}`;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

exports.uploadProfilePic = (req, res) => {
    upload.single('profilePic')(req, res, async (err) => {
        if (err) {
            console.error('Error uploading profile picture:', err);
            return res.status(500).json({ message: 'Error uploading profile picture', error: err });
        }

        try {
            const user = await User.findById(req.params.userId);
            user.profilePic = req.file.filename;
            await user.save();
            res.status(200).json({ message: 'Profile picture uploaded successfully', profilePic: req.file.filename });
        } catch (error) {
            console.error('Error saving profile picture:', error);
            res.status(500).json({ message: 'Error saving profile picture', error });
        }
    });
};

exports.getProfilePic = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.status(200).json({ profilePic: user.profilePic, username: user.username });
    } catch (error) {
        console.error('Error fetching profile picture:', error);
        res.status(500).json({ message: 'Error fetching profile picture', error });
    }
};