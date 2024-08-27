import { Types } from "mongoose";
import { Base } from "./base.entity";

export interface Message extends Base {
  content?: string;
  role?: "user" | "assistant";
}

export interface Chat extends Base {
  messages?: Message[];
  creator: Types.ObjectId;
  title: string;
}
