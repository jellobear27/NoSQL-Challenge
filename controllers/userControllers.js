const User = require('../models/user'); // Import your User model

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('thoughts').populate('friends');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('thoughts').populate('friends');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(400).json({ message: 'Error creating user', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(400).json({ message: 'Error updating user', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Remove associated thoughts when a user is deleted
    // ... logic to remove associated thoughts ...

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

const addFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: 'Friend already exists in user\'s friend list' });
    }

    user.friends.push(friendId);
    await user.save();

    return res.status(200).json({ message: 'Friend added successfully', user });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding friend', error: error.message });
  }
};

const removeFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.friends.includes(friendId)) {
      return res.status(400).json({ message: 'Friend does not exist in user\'s friend list' });
    }

    user.friends = user.friends.filter(id => id.toString() !== friendId);
    await user.save();

    return res.status(200).json({ message: 'Friend removed successfully', user });
  } catch (error) {
    return res.status(500).json({ message: 'Error removing friend', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend
};
