import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    token: {
      type: Number,
      default: 3,
      min: 0,
    },
    avatar: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
    profileData: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// Prevent mongoose from throwing an error if the model is compiled multiple times
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
