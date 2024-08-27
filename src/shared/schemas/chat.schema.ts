import { Schema, model } from "mongoose";
import { Chat, Message } from "../entities";

const messageSchema: Schema = new Schema<Message>({
  content: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  created_at: {
    type: Date,
    default: function () {
      return Date.now();
    },
  },
  updated_at: {
    type: Date,
  },
});

const chatSchema: Schema = new Schema<Chat>({
  messages: [messageSchema],
  creator: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: function () {
      return Date.now();
    },
  },
  updated_at: {
    type: Date,
  },
});

export default model<Chat>("Chat", chatSchema);
