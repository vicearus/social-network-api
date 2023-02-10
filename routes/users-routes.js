const router = require('express').Router();

const { User, Thought } = require('../models');

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

// Get single user by id
router.get('/:id', async (req, res) => {
    try {
        const oneUser = await User.findById(req.params.id)
            .populate('thoughts')
            .populate('friends');
        res.json(oneUser);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

// Post new user
router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

// Update a user
router.put('/:id', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ message: 'User updated!' });
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
            .then((deletedUser) => {
                return Thought.deleteMany({ _id: { $in: deletedUser.thoughts } })
            });
        res.status(200).json({ message: 'User deleted!' })
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

// Add a user to another user's friends list
router.post('/:userID/friends/:friendID', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.userID, {
            $push: { friends: req.params.friendID }
        });
        res.status(200).json({ message: 'User has been added to friends list!' })
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

// Delete a user from another user's friends list
router.delete('/:userID/friends/:friendID', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.userID, {
            $pull: { friends: req.params.friendID }
        });
        res.status(200).json({ message: 'User has been removed from friends list!' })
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
})

module.exports = router;