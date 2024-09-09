import { Schema, model } from "mongoose";
import { FileManager } from "../entities";
import { FileManagerObjectTypes } from "../constants";

const fileManagerSchema: Schema = new Schema<FileManager>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  key: {
    type: String,
  },
  size: {
    type: String,
  },
  extension: {
    type: String,
  },
  parent: {
    type: Schema.Types.ObjectId,
  },
  object_type: {
    type: String,
    enum: [FileManagerObjectTypes.FILE, FileManagerObjectTypes.FOLDER, FileManagerObjectTypes.CODE],
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

export default model<FileManager>("FileManager", fileManagerSchema);
