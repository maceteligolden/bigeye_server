import { injectable } from "tsyringe";
import { Stripe } from "../../../shared/facade";
import { PlanRepository, UserRepository } from "../../../shared/repositories";
import {
  CancelSubscriptionInput,
  CancelSubscriptionOutput,
  CreateSubscriptionInput,
  CreateSubscriptionOutput,
} from "../dto";
import { BadRequestError, InternalServerError } from "../../../shared/errors";

@injectable()
export default class SubscriptionService {
  constructor(
    private stripe: Stripe,
    private planRepository: PlanRepository,
    private userRepository: UserRepository,
  ) {}

  async createSubscription(args: CreateSubscriptionInput): Promise<CreateSubscriptionOutput> {
    const { user, plan } = args;

    const checkUser = await this.userRepository.fetchOneByCognitoId(user);

    if (!checkUser) {
      throw new BadRequestError("user not found");
    }

    const { stripe_customer_id, stripe_card_id } = checkUser;

    const checkPlan = await this.planRepository.fetchOneById(plan);

    if (!checkPlan) {
      throw new BadRequestError("failed to fetch plan");
    }

    const { stripe_price_id } = checkPlan;

    const { subscription_id } = await this.stripe.createSubscription({
      price_id: stripe_price_id,
      customer_id: stripe_customer_id ? stripe_customer_id : "",
      payment_method: stripe_card_id,
      user: checkUser._id ? checkUser._id.toString() : "",
      plan,
    });

    if (!subscription_id) {
      throw new InternalServerError("failed to create subscription");
    }

    //TODO: send notification via push notification and email notification

    return {
      processing: true,
    };
  }

  async cancelSubscription(args: CancelSubscriptionInput): Promise<CancelSubscriptionOutput> {
    return {};
  }
}
