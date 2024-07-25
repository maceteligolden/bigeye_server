export type GetProfileOutput = {
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    payment_method: string;
    card_type: string;
    card_last_digits: string;
    card_expire_date: string;
  };