import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const accountSchema = new Schema({
  user: {
    type: ObjectId,
    ref: "User"
  },
  ammount: {
    type: String,
    trim: true
  },
  address: String,
  country: String,
  accountImage: String
});

// instance schema
export default mongoose.model("Account", accountSchema);
