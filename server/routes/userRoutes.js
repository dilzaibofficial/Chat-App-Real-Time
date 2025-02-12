const express = require('express');
const { getUser, uploadProfilePic } = require('../controllers/userController');
const router = express.Router();

router.get('/:userId', getUser);
router.post('/:userId/profile-pic', uploadProfilePic, (req, res) => {
    res.status(200).json({ message: 'Profile picture uploaded' });
});

module.exports = router;