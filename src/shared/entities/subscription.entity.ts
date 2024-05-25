import { SubscriptionStatus } from "../constants";
import { Base } from "./base.entity";

export default interface Subscription extends Base {
  user: string;
  plan: string;
  stripe_subscription_id: string;
  status: SubscriptionStatus;
  start_date: Date;
  end_date: Date;
  amount: string;
}
