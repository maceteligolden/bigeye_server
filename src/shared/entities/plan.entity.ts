import { Base } from "./base.entity";

export default interface Plan extends Base {
  name: string;
  amount: string;
  stripe_plan_id: string;
  stripe_price_id: string;
}
