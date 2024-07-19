import { Subscription } from "../../../shared/entities";

export type CreateSubscriptionInput = {
  user: string;
  plan: string;
};

export type CreateSubscriptionOutput = {
  processing: boolean;
};

export type CancelSubscriptionInput = {
  user_id: string;
};

export type CancelSubscriptionOutput = {
  status: boolean;
};
