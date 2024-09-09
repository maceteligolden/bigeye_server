import mongoose from "mongoose";
import { Base } from "./base.entity";
import Feature from "./feature.entity";

export default interface Plan extends Base {
  name: string;
  amount: string;
  stripe_plan_id: string;
  stripe_price_id: string;
  features?: mongoose.Types.ObjectId[]
}
