const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .populate('thought')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a user
  createUser(req, res) {
    User.create( req.body, { runValidators: true, new: true })
      .then((course) => res.json(course))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Update a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Delete a user
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID!' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and thoughts deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  // Add a new friend to users friend list
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId }, 
      { $push: { friends: req.params.friendId } },
      { runValidators: true, new: true } )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Add a new friend to users friend list
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId }, 
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true } )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  }
};
