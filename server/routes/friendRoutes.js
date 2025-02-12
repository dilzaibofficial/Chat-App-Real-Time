const express = require('express');
const { sendFriendRequest, getFriendRequests, acceptFriendRequest, declineFriendRequest, getFriends } = require('../controllers/friendController');
const router = express.Router();

router.post('/request', sendFriendRequest);
router.get('/requests/:userId', getFriendRequests);
router.post('/accept', acceptFriendRequest);
router.post('/decline', declineFriendRequest);
router.get('/:userId', getFriends);

module.exports = router;