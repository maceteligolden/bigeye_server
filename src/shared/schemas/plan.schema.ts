import { Schema, model } from "mongoose";
import { Plan } from "../entities";

const planSchema: Schema = new Schema<Plan>({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  stripe_plan_id: {
    type: String,
    required: true,
  },
  stripe_price_id: {
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

export default model<Plan>("Plan", planSchema);
