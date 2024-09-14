import mongoose from "mongoose";
import { Base } from "./base.entity";

export default interface Feature extends Base {
  title?: string;
  plan_id?: mongoose.Types.ObjectId;
  stripe_product_feature_id?: string;
}
