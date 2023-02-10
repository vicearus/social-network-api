const router = require('express').Router();
const { Thought, User } = require('../models');

// Get all thoughts
router.get('/', async (req, res) => {
    try {
        const thoughts = await Thought.find({});
        res.json(thoughts);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

// Get single thought
router.get('/:id', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.id)
        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

// Post a new thought
router.post('/', async (req, res) => {
    try {
        const thought = await Thought.create(req.body)
            .then((newThought) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: newThought._id } },
                    { new: true }
                )
            });
        res.json({ message: `New thought added under user ID ${req.body.userId}` });
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

// Update a thought
router.put('/:id', async (req, res) => {
    try {
        await Thought.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ message: 'Thought updated!' });
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

// Delete a thought
router.delete('/:id', async (req, res) => {
    try {
        await Thought.findByIdAndDelete(req.params.id)
            .then((deletedThought) => {
                return User.findOneAndUpdate(
                    { username: deletedThought.username },
                    { $pull: { thoughts: req.params.id } }
                )
            })
        res.status(200).json({ message: 'Thought deleted!' });
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

// Add a reaction to Thought reactions array
router.post('/:thoughtId/reactions', async (req, res) => {
    try {
        await Thought.findByIdAndUpdate(req.params.thoughtId, {
            $push: { reactions: req.body }
        });
        res.status(200).json({ message: 'Reaction added to thought!' })
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

// Delete a reaction
router.delete('/:thoughtId/reactions', async (req, res) => {
    try {
        await Thought.findByIdAndUpdate(req.params.thoughtId, {
            $pull: { reactions: { reactionId: req.body.reactionId } }
        });
        res.status(200).json({ message: 'Reaction deleted!' })
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

module.exports = router;