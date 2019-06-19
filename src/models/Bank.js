import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const bankSchema = new Schema({
  bankName: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Bank Name required"]
  },
  bankCode: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Bank Code required"]
  },
  state: {
    type: String,
    default: "active",
    enum: ["active", "blocked"]
  }
});

// instance schema
export default mongoose.model("Bank", bankSchema);
