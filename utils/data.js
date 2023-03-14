const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { faker } = require('@faker-js/faker');

connection.on('error', (err) => err);

const createUser = async (numberOfUsers) => {
  const users = [];
  for (let i=0; i < numberOfUsers; i++ ){
    users.push({
      username: faker.internet.userName(),
      email: faker.internet.email()
    })
  };
  return users;
}

const createThought = async (users, numberOfThoughts) => {
  for (let i=0; i < numberOfThoughts; i++){
    // randomly pick a user by index# to be the poster
    let userWhoIsPosting = faker.datatype.number({ max: users.length-1 });
    // randomly generate a thought text, and pull the username from the userWhoIsPosting
    let thought = { 
      thoughtText: faker.lorem.sentence(5),
      username: users[userWhoIsPosting].username
    }
    // create the thought
    await Thought.collection.insertOne(thought)
    // then, pass the thought object to the find and update user function
    .then(async (thought) => {
      // process the objectID we are getting from the thought object to be useable, so that it can be added to the users thoughts array.
      let thoughtId = JSON.stringify(thought.insertedId);
      let rawId = thoughtId.split("\"")
      // find the userWhoIsPosting, push the thought ID into their thoughts array.
      await User.collection.findOneAndUpdate(
        { username: users[userWhoIsPosting].username },
        { $push: { thoughts: rawId[1] } },
        { runValidators: true, new: true }
      )
    })
  }
}

module.exports = { createUser, createThought };



