import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const accountSchema = new Schema({
  user: {
    type: ObjectId,
    ref: "User"
  },
  age: Number,
  contact: String,
  address: String,
  city: String,
  userProfileImage: String
});
