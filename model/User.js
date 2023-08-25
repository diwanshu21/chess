import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// Define the user schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    games: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Game'
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("find", function () {
  this._startTime = Date.now();
});

userSchema.post("find", function () {
  if (this._startTime != null) {
    console.log("Runtime in MS: ", Date.now() - this._startTime);
  }
});

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.createJWT = function () {
  return jwt.sign(
    { username: this.username, userId: this._id },
    process.env.SECRET_KEY,
    {
      expiresIn: "30d",
    }
  );
};

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // Compare the given password with the stored password
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw new Error(err);
  }
};

// Create the user model from the schema
const User = mongoose.model("User", userSchema);

// Export the user model
export default User;
