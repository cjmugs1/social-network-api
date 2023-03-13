const { User, Thought } = require('../models');
const { faker } = require('@faker-js/faker');

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
    let userWhoIsPosting = faker.datatype.number({ max: users.length });
    Thought.create(
      { 
        thoughtText: faker.lorem.text(),
        username: users[userWhoIsPosting].username
      }, 
      { runValidators: true, new: true })
    .then((thought) => {
      User.findOneAndUpdate(
        { username: thought.username },
        { $push: { thoughts: thought._id } },
        { runValidators: true, new: true }
      )
    })
  }
}


// const createThought = async (users) => {
//   const thoughts = [];
//   for (let i=0; i < users.length; i++) {
//     // let numberOfThoughts = faker.datatype.number({ max: 3 })
//     for (let t=0; t < faker.datatype.number({ max: 3 }); t++) {
//       thoughts.push({
//         // thoughtText: faker.lorem.text({ length: { min: 1, max: 280 } }),
//         thoughtText: faker.lorem.text(),
//         username: users[i].username,
//       })
//   }};
//   return thoughts;
// }


// Get a random item given an array
// const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// // Gets a random full name
// const getRandomName = () =>
//   `${getRandomArrItem(names)} ${getRandomArrItem(names)}`;

// // Function to generate random assignments that we can add to student object.
// const getRandomAssignments = (int) => {
//   const results = [];
//   for (let i = 0; i < int; i++) {
//     results.push({
//       assignmentName: getRandomArrItem(appDescriptions),
//       score: Math.floor(Math.random() * (99 - 70 + 1) + 70),
//     });
//   }
//   return results;
// };

// Export the functions for use in seed.js
module.exports = { createUser, createThought };



