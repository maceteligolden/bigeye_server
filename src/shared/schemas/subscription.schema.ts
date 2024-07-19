import { Schema, model } from "mongoose";
import { Subscription } from "../entities";
import { SubscriptionStatus } from "../constants";

const subscriptionSchema: Schema = new Schema<Subscription>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  plan: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Plan",
  },
  stripe_subscription_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: [SubscriptionStatus.ACTIVE, SubscriptionStatus.INACTIVE, SubscriptionStatus.EXPIRED, SubscriptionStatus.CANCELLED],
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
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

export default model<Subscription>("Subscription", subscriptionSchema);
