import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
