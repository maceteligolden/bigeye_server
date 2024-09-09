import mongoose from "mongoose";
import { FileManagerObjectTypes } from "../constants";
import { Base } from "./base.entity";

export default interface FileManager extends Base {
  object_type?: FileManagerObjectTypes;
  name: string;
  parent?: mongoose.Types.ObjectId;
  extension?: string;
  size?: string;
  key?: string;
  user: mongoose.Types.ObjectId;
}
