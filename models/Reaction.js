const { Schema, Types } = require('mongoose');
const formatDate = require('../utils/dateFormatter');

// Schema to create a reaction model. we dont need to create a model, just need to use the schema for validation of reactions.
const reactionSchema = new Schema(
  {
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
      minlength: 1,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: formatDate,
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

module.exports = reactionSchema;
