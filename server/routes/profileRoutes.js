const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.post('/upload/:userId', profileController.uploadProfilePic);
router.get('/:userId', profileController.getProfilePic);

module.exports = router;