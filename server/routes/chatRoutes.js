const express = require('express');
const { sendMessage, getMessages, getLastMessage, getChatList } = require('../controllers/chatController');
const router = express.Router();

router.post('/', sendMessage);
router.get('/:userId/:friendId', getMessages);
router.get('/last-message/:userId/:friendId', getLastMessage);
router.get('/list/:userId', getChatList); // New route for fetching chat list

module.exports = router;