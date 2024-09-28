import { Schema, model } from "mongoose";
import { Blog, Comment } from "../entities";

const blogSchema: Schema = new Schema<Blog>({
  author: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  total_views: {
    type: String,
    default: "0",
  },
  total_shares: {
    type: String,
    default: "0",
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

export default model<Blog>("Blog", blogSchema);
