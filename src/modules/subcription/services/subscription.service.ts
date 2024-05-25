import { injectable } from "tsyringe";
import { Stripe } from "../../../shared/facade";
import { PlanRepository, SubscriptionRepository, UserRepository } from "../../../shared/repositories";
import { CreateSubscriptionInput, CreateSubscriptionOutput } from "../dto";
import { SubscriptionStatus } from "../../../shared/constants";
import { BadRequestError } from "../../../shared/errors";

@injectable()
export default class SubscriptionService {
  constructor(
    private stripe: Stripe,
    private subscriptionRepository: SubscriptionRepository,
    private planRepository: PlanRepository,
    private userRepository: UserRepository,
  ) {}

  async createSubscription(args: CreateSubscriptionInput): Promise<CreateSubscriptionOutput> {
    const { user, plan } = args;

    const { stripe_customer_id, stripe_card_id } = await this.userRepository.fetchOneById(user);

    if (!stripe_customer_id) {
      throw new BadRequestError("user not found");
    }

    const { stripe_price_id, amount } = await this.planRepository.fetchOneById(plan);

    if (!stripe_price_id) {
      throw new BadRequestError("failed to fetch plan");
    }

    const { subscription_id, subscription_end_date } = await this.stripe.createSubscription({
      price_id: stripe_price_id,
      customer_id: stripe_customer_id ? stripe_customer_id : "",
      payment_method: stripe_card_id,
    });

    if (!subscription_id) {
      throw new BadRequestError("failed to create subscription");
    }

    const start_date = new Date();

    const response = await this.subscriptionRepository.create({
      user,
      plan,
      stripe_subscription_id: subscription_id,
      status: SubscriptionStatus.ACTIVE,
      start_date,
      end_date: new Date(subscription_end_date),
      amount,
    });

    if (!response) {
      throw new BadRequestError("failed to add subscription to database");
    }

    //TODO: send notification via push notification and email notification

    return {
      subscription: response,
    };
  }
}
