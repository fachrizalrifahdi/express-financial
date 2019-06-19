import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const paymentSchema = new Schema({
  user: {
    type: ObjectId,
    ref: "User"
  },
  paymentChannel: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Payment Channel required"]
  }
});

// instance schema
export default mongoose.model("Payment", paymentSchema);
