// src/models/message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiverRoom: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
