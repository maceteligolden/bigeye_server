import { Types } from "mongoose";
import { Base } from "./base.entity";

export default interface Blog extends Base {
  title?: string;
  content?: string;
  total_views?: string;
  total_shares?: string;
  author?: Types.ObjectId;
}
