import { Schema, model } from "mongoose";
import { Plan } from "../entities";
import { featureSchema } from ".";

const planSchema: Schema = new Schema<Plan>({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  features: [{
    title: {
      type: String,
      required: true,
    },
    plan_id: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    stripe_product_feature_id: {
      type: String,
      required: true
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
  }],
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
