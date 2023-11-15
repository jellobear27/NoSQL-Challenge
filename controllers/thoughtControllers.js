const Thought = require('../models/Thought'); // Import your Thought model
const User = require('../models/User'); // Import your User model

const getAllThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find();
    return res.status(200).json(thoughts);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching thoughts', error: error.message });
  }
};

const getSingleThought = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    return res.status(200).json(thought);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching thought', error: error.message });
  }
};

const createThought = async (req, res) => {
  try {
    const { userId } = req.body;
    const newThought = await Thought.create(req.body);

    // Push the created thought's _id to the associated user's thoughts array field
    await User.findByIdAndUpdate(userId, { $push: { thoughts: newThought._id } });

    return res.status(201).json(newThought);
  } catch (error) {
    return res.status(400).json({ message: 'Error creating thought', error: error.message });
  }
};

const updateThought = async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true });
    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    return res.status(200).json(updatedThought);
  } catch (error) {
    return res.status(400).json({ message: 'Error updating thought', error: error.message });
  }
};

const deleteThought = async (req, res) => {
  try {
    const deletedThought = await Thought.findByIdAndDelete(req.params.thoughtId);
    if (!deletedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    // Remove the thought's _id from associated user's thoughts array field
    await User.updateMany({}, { $pull: { thoughts: req.params.thoughtId } });

    return res.status(200).json({ message: 'Thought deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting thought', error: error.message });
  }
};

module.exports = {
  getAllThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought
};
