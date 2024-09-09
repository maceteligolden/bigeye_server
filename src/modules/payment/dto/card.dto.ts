export type AuthorizeCardInput = {
  user_id: string;
};

export type AuthorizeCardOutput = {
  client_secret: string;
};

export type SaveCardInput = {
  stripe_customer_id: string;
  stripe_card_id: string;
};

export type SaveCardOutput = {
  isCardSaved: boolean;
};
