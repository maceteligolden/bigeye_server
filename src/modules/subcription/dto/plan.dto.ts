import mongoose from "mongoose";

export type CreatePlanOutput = {
  plan_id: string;
  price_id: string;
  name: string;
  amount: string;
};

export type GetActivePlanOutput = {
  _id: string | mongoose.Types.ObjectId | undefined;
  amount: string;
  name: string;
  createdDate: Date;
};
