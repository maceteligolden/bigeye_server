import { Base } from "./base.entity";

export default interface User extends Base {
  awscognito_user_id?: string;
  stripe_customer_id?: string;
  stripe_card_id?: string;
  stripe_card_last_digits?: string;
  stripe_card_expire_date?: string;
  stripe_card_type?: string;
}
