import { Schema, model } from "mongoose";
import { User } from "../entities";
import { UserAccountStatus } from "../constants";

const userSchema: Schema = new Schema<User>({
  awscognito_user_id: {
    type: String,
    required: true,
  },
  stripe_customer_id: {
    type: String,
  },
  stripe_card_id: {
    type: String,
  },
  stripe_card_last_digits: {
    type: String,
  },
  stripe_card_expire_date: {
    type: String,
  },
  stripe_card_type: {
    type: String,
  },
  active_plan: {
    type: Schema.Types.ObjectId,
    ref: "Plan",
  },
  status: {
    type: String,
    enum: [UserAccountStatus.ACTIVE, UserAccountStatus.BLOCKED, UserAccountStatus.INCOMPLETE, UserAccountStatus.UNCONFIRM],
    required: true
  },
  isFirstLogin: {
    type: Boolean,
    default: false
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

export default model<User>("User", userSchema);
