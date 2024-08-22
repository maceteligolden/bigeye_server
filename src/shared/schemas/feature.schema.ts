import { Schema, model } from "mongoose";
import { Feature } from "../entities";

const featureSchema: Schema = new Schema<Feature>({
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
});

export default model<Feature>("Feature", featureSchema);
