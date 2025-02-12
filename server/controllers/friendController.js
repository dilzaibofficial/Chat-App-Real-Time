const User = require('../models/User');

exports.sendFriendRequest = async (req, res) => {
    const { userId, username } = req.body;

    try {
        console.log(`Sending friend request from userId: ${userId} to username: ${username}`);
        const friend = await User.findOne({ username });
        if (!friend) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.friends.includes(friend._id)) {
            console.log('Already friends');
            return res.status(400).json({ message: 'Already friends' });
        }

        if (user.friendRequests.includes(friend._id)) {
            console.log('Friend request already sent');
            return res.status(400).json({ message: 'Friend request already sent' });
        }

        user.friendRequests.push(friend._id);
        await user.save();

        friend.friendRequests.push(user._id);
        await friend.save();

        console.log('Friend request sent');
        res.status(200).json({ message: 'Friend request sent' });
    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ message: 'Error sending friend request', error });
    }
};

exports.getFriendRequests = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).populate('friendRequests', 'username');
        res.status(200).json(user.friendRequests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching friend requests', error });
    }
};

exports.acceptFriendRequest = async (req, res) => {
    const { userId, requestId } = req.body;

    try {
        const user = await User.findById(userId);
        const friend = await User.findById(requestId);

        user.friends.push(friend._id);
        user.friendRequests = user.friendRequests.filter(id => id.toString() !== requestId);
        await user.save();

        friend.friends.push(user._id);
        friend.friendRequests = friend.friendRequests.filter(id => id.toString() !== userId);
        await friend.save();

        res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
        res.status(500).json({ message: 'Error accepting friend request', error });
    }
};

exports.declineFriendRequest = async (req, res) => {
    const { userId, requestId } = req.body;

    try {
        const user = await User.findById(userId);
        user.friendRequests = user.friendRequests.filter(id => id.toString() !== requestId);
        await user.save();

        const friend = await User.findById(requestId);
        friend.friendRequests = friend.friendRequests.filter(id => id.toString() !== userId);
        await friend.save();

        res.status(200).json({ message: 'Friend request declined' });
    } catch (error) {
        res.status(500).json({ message: 'Error declining friend request', error });
    }
};

exports.getFriends = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).populate('friends', 'username');
        res.status(200).json(user.friends);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching friends', error });
    }
};