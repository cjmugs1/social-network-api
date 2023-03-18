const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { faker } = require('@faker-js/faker');

// need to connect to the mongoDB in order to perform the createThought function, which is editing the DB.
connection.on('error', (err) => err);

// we do not bother to edit the mongoDB directly with this function, we just want to create an array of users and send it over to the seeds.js, which will handle adding the users to the DB. this way, we can use the array of users later in the create thought function.
const createUser = async (numberOfUsers) => {
  const users = [];
  for (let i=0; i < numberOfUsers; i++ ){
    // generate random user using faker.js
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



