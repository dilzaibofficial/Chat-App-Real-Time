const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
    const { sender, receiver, text } = req.body;

    try {
        const message = new Message({ sender, receiver, text });
        await message.save();
        res.status(200).json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message', error });
    }
};

exports.getMessages = async (req, res) => {
    const { userId, friendId } = req.params;

    try {
        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: friendId },
                { sender: friendId, receiver: userId }
            ]
        }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages', error });
    }
};

exports.getLastMessage = async (req, res) => {
    const { userId, friendId } = req.params;

    try {
        const lastMessage = await Message.findOne({
            $or: [
                { sender: userId, receiver: friendId },
                { sender: friendId, receiver: userId }
            ]
        }).sort({ createdAt: -1 });
        res.status(200).json(lastMessage);
    } catch (error) {
        console.error('Error fetching last message:', error);
        res.status(500).json({ message: 'Error fetching last message', error });
    }
};

exports.getChatList = async (req, res) => {
    const { userId } = req.params;

    try {
        const messages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: userId },
                        { receiver: userId }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ['$sender', userId] },
                            '$receiver',
                            '$sender'
                        ]
                    },
                    lastMessage: { $first: '$text' },
                    createdAt: { $first: '$createdAt' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'friend'
                }
            },
            {
                $unwind: '$friend'
            },
            {
                $project: {
                    friendId: '$_id',
                    friendUsername: '$friend.username',
                    friendProfilePic: '$friend.profilePic',
                    lastMessage: 1,
                    createdAt: 1
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching chat list:', error);
        res.status(500).json({ message: 'Error fetching chat list', error });
    }
};