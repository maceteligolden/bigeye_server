import { Subscription } from "../../../shared/entities";

export type CreateSubscriptionInput = {
  user: string;
  plan: string;
};

export type CreateSubscriptionOutput = {
  processing: boolean;
};

export type CancelSubscriptionInput = {};

export type CancelSubscriptionOutput = {};
