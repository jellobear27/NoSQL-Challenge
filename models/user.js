const { Schema, model, Types } = require('mongoose');

const userschema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      require: true,
      trimmed: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      match: [
        /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
        "Error try again",
      ],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

userschema.virtual("friendCount").get(function () {
  return this.friends.length;
});
const User = model("user", userschema);
module.exports = User;
