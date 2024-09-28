import { Types } from "mongoose";
import { Base } from "./base.entity";

export default interface Comment extends Base {
  name?: string;
  content?: string;
  parent_id?: Types.ObjectId;
  blog_id?: Types.ObjectId;
}
