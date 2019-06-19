import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const depositSchema = new Schema({
  user: {
    type: ObjectId,
    ref: "User"
  },
  bank: {
    type: ObjectId,
    ref: "Bank"
  },
  ammount: {
    type: ObjectId,
    ref: "Account"
  },
  deposit: {
    type: String,
    trim: true
  }
});

// instance schema
export default mongoose.model("Deposit", depositSchema);
