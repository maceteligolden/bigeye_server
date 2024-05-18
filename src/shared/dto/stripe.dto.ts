export type SetupIntentInput = {
  customer: string;
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

export type FetchCardDetailsInput = {
  payment_method_id: string;
};

export type FetchCardDetailsOutput = {
  last4: string;
  exp_month: string;
  exp_year: string;
  brand: string;
};
