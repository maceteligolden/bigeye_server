export type SetupIntentInput = {
  customer: string;
  user_id: string;
};

export type SetupIntentOutput = {
  client_secret: string;
};

export type PaymentIntentInput = {
  customer: string;
  amount: number;
  payment_method: string;
};

export type PaymentIntentOutput = {
  charge_id: string;
};

export type PaymentConfirmInput = {
  id: string;
  payment_id: string;
};

export type CreateCustomerInput = {
  email: string;
  name: string;
};

export type CreateCustomerOutput = {
  customer_id: string;
};

export type DeleteCustomerInput = {
  customer_id: string;
};

export type DeleteCustomerOutput = {
  isDeleted: boolean;
};

export type FetchCardDetailsInput = {
  payment_method_id: string;
  stripe_customer_id: string;
};

export type FetchCardDetailsOutput = {
  last4: string;
  exp_month: string;
  exp_year: string;
  brand: string;
};

export type StripeCreatePlanInput = {
  name: string;
  amount: string;
};

export type StripeCreatePlanOutput = {
  plan_id: string;
  price_id: string;
};

export type StripeDeletePlanInput = {
  plan_id: string;
};

export type StripeDeletePlanOutput = {
  isPlanDeleted: boolean;
};

export type StripeCreateSubscriptionInput = {
  customer_id: string;
  price_id: string;
  payment_method: string | undefined;
  user: string;
  plan: string;
};

export type StripeCreateSubscriptionOutput = {
  subscription_id: string;
  subscription_end_date: string;
};

export type StripeUpdateSubscriptionInput = {
  subscription_id: string;
  order_id: string;
};

export type StripeUpdateSubscriptionOutput = {
  isUpdated: boolean;
};

export type StripeCancelSubscriptionInput = {
  subscription_id: string;
};

export type StripeCancelSubscriptionOutput = {
  status: boolean;
};
