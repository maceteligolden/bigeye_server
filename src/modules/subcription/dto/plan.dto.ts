import mongoose from "mongoose";

export type CreatePlanOutput = {
  plan_id: string;
  price_id: string;
  name: string;
  amount: string;
};

export type GetActivePlanOutput = {
  active_plan_id: string | mongoose.Types.ObjectId | undefined;
};
