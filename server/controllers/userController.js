const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${req.params.userId}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

exports.uploadProfilePic = upload.single('profilePic');

exports.getUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};