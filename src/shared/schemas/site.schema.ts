import { Schema, model } from "mongoose";
import { Site } from "../entities";

const siteSchema: Schema = new Schema<Site>({
  user_id: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },
  healthcheck_link: {
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

export default model<Site>("Site", siteSchema);