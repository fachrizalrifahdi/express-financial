import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const saltRounds = 10;

// schema database
const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address"
      ]
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "Phone required"]
    },
    userName: {
      type: String,
      unique: true,
      required: true,
      trim: [true, "Username required"]
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password required"]
    },
    firstName: {
      type: String,
      required: [true, "Firstname required"]
    },
    lastName: {
      type: String,
      required: [true, "Lastname required"]
    },
    state: {
      type: String,
      default: "active",
      enum: ["active", "blocked"]
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "partner", "admin"]
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", function(next) {
  const user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = (candidatePassword, callback) => {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

// export User schema
export default mongoose.model("User", userSchema);
