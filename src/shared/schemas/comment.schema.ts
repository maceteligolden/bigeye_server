import { Schema, model } from "mongoose";
import { Blog, Comment } from "../entities";

const commentSchema: Schema = new Schema<Comment>({
  parent_id: {
    type: Schema.ObjectId,
    ref: "Comment",
  },
  blog_id: {
    type: Schema.ObjectId,
    ref: "Blog",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  name: {
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

export default model<Comment>("Comment", commentSchema);
