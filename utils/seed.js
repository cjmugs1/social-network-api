const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { createUser, createThought } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  // Drop existing courses
  await User.deleteMany({});

  // Drop existing students
  await Thought.deleteMany({});

  //  create the randomly generated users and then add them to the collection
  const users = await createUser(20);
  await User.collection.insertMany(users);

  // use the users that we generated to create some thoughts
  const thoughts = await createThought(users, 20);

  console.info('Seeding complete! 🌱');
  process.exit(0);
});
