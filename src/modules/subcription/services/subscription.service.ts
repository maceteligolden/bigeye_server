import { injectable } from "tsyringe";
import { Stripe } from "../../../shared/facade";
import { PlanRepository, SubscriptionRepository, UserRepository } from "../../../shared/repositories";
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
    private subscriptionRepository: SubscriptionRepository,
  ) {}

  async createSubscription(args: CreateSubscriptionInput): Promise<CreateSubscriptionOutput> {
    const { user, plan } = args;

    // fetch user details using cognito id
    const checkUser = await this.userRepository.fetchOneByCognitoId(user);

    if (!checkUser) {
      throw new BadRequestError("user not found");
    }

    const { stripe_customer_id, stripe_card_id } = checkUser;

    // fetch select plan details
    const checkPlan = await this.planRepository.fetchOneById(plan);

    if (!checkPlan) {
      throw new BadRequestError("failed to fetch plan");
    }

    const { stripe_price_id } = checkPlan;

    const subscription = await this.subscriptionRepository.fetchActiveByUserId(checkUser._id!);

    if (subscription) {
      throw new BadRequestError("cannot have 2 active subscription. maybe update your subscription plan")
    }
    // create subscription using stripe facade
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
    const { user_id } = args;

    const checkUser = await this.userRepository.fetchOneByCognitoId(user_id);

    if (!checkUser) {
      throw new BadRequestError("user not found");
    }

    const stripeResponse = await this.subscriptionRepository.fetchActiveByUserId(checkUser._id!);

    const response = await this.stripe.cancelSubscription({ subscription_id: stripeResponse?.stripe_subscription_id! });

    return {
      status: response.status,
    };
  }
}
