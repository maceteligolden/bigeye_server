import { injectable } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import {
  CreateCustomerInput,
  CreateCustomerOutput,
  DeleteCustomerInput,
  DeleteCustomerOutput,
  FetchCardDetailsInput,
  FetchCardDetailsOutput,
  PaymentConfirmInput,
  PaymentIntentInput,
  PaymentIntentOutput,
  SetupIntentInput,
  SetupIntentOutput,
  StripeCreatePlanInput,
  StripeCreatePlanOutput,
  StripeCreateSubscriptionInput,
  StripeCreateSubscriptionOutput,
  StripeDeletePlanInput,
  StripeDeletePlanOutput,
  StripeUpdateSubscriptionInput,
  StripeUpdateSubscriptionOutput,
} from "../dto";
import { StatusCodes, StripeCurriencies, StripePaymentMethodType, SubscriptionStatus } from "../constants";
import { Res, StripeHelper } from "../helper";
import { LoggerService } from "../services";
import { InternalServerError } from "../errors";
import { SubscriptionRepository } from "../repositories";
import { Database } from ".";
const stripe = require("stripe")(
  process.env.NODE_ENV === "dev" ? `${process.env.STRIPE_TEST_API_KEY}` : `${process.env.STRIPE_PROD_API_KEY}`,
);

@injectable()
export default class Stripe {
  constructor(
    private stripeHelper: StripeHelper,
    private loggerService: LoggerService,
    private subscriptionRepository: SubscriptionRepository,
    private database: Database,
  ) {}

  async setupIntent(args: SetupIntentInput): Promise<SetupIntentOutput> {
    const { customer } = args;
    const { client_secret } = await stripe.setupIntents.create({
      customer,
      payment_method_types: [StripePaymentMethodType.CARD],
    });

    if (!client_secret) {
      throw new InternalServerError("failed to create setupintent");
    }

    return {
      client_secret,
    };
  }

  async paymentIntent(args: PaymentIntentInput): Promise<PaymentIntentOutput> {
    const { customer, amount, payment_method } = args;
    const { id } = await stripe.paymentIntents.create({
      amount: this.stripeHelper.currencyConverter(amount),
      currency: StripeCurriencies.USD,
      payment_method,
      metadata: {},
      payment_method_types: [StripePaymentMethodType.CARD],
      customer,
    });

    if (!id) {
      throw new InternalServerError("failed to create payment intent");
    }

    return {
      charge_id: id,
    };
  }

  async paymentConfirm(args: PaymentConfirmInput): Promise<void> {
    const { id, payment_id } = args;

    const response = await stripe.paymentIntents.confirm(id, { payment_method: payment_id });

    if (!response) {
      throw new InternalServerError("failed to confirm payment");
    }
  }

  async createCustomer(args: CreateCustomerInput): Promise<CreateCustomerOutput> {
    const { email, name } = args;
    const customer = await stripe.customers.create({
      email,
      name,
    });

    if (!customer) {
      throw new InternalServerError("failed to create customer");
    }

    return {
      customer_id: customer.id,
    };
  }

  async deleteCustomer(args: DeleteCustomerInput): Promise<DeleteCustomerOutput> {
    const { customer_id } = args;
    const response = await stripe.customers.del(customer_id);

    if (!response) {
      throw new InternalServerError("failed to delete customer");
    }

    return {
      isDeleted: response.deleted,
    };
  }

  async deleteCard(payment_method_id: string): Promise<void> {
    const response = await stripe.paymentMethods.detach(payment_method_id);

    if (!response) {
      throw new InternalServerError("failed to delete card");
    }
  }

  async fetchCardDetails(args: FetchCardDetailsInput): Promise<FetchCardDetailsOutput> {
    const { payment_method_id } = args;

    const { card } = await stripe.paymentMethods.retrieve(payment_method_id);

    if (!card) {
      throw new InternalServerError("failed to retrieved card");
    }

    return {
      last4: card.last4,
      exp_month: card.exp_month,
      exp_year: card.exp_year,
      brand: card.brand,
    };
  }

  async createPlan(args: StripeCreatePlanInput): Promise<StripeCreatePlanOutput> {
    const { amount, name } = args;

    const { id, product } = await stripe.prices.create({
      currency: "usd",
      unit_amount: Number(amount),
      recurring: {
        interval: "month",
      },
      product_data: {
        name,
      },
    });

    if (!id) {
      throw new InternalServerError("failed to create price");
    }

    const response = await stripe.plans.create({
      amount: Number(amount),
      currency: "usd",
      interval: "month",
      product,
    });

    if (!response) {
      throw new InternalServerError("failed to create plan");
    }
    return {
      plan_id: response.id,
      price_id: id,
    };
  }

  async deletePlan(args: StripeDeletePlanInput): Promise<StripeDeletePlanOutput> {
    const { plan_id } = args;

    const response = await stripe.plans.del(plan_id);

    if (!response) {
      throw new InternalServerError("failed to delete plan");
    }

    return {
      isPlanDeleted: response.deleted,
    };
  }

  async createSubscription(args: StripeCreateSubscriptionInput): Promise<StripeCreateSubscriptionOutput> {
    const { customer_id, price_id, payment_method, user, plan } = args;

    const response = await stripe.subscriptions.create({
      customer: customer_id,
      currency: "usd",
      items: [
        {
          price: price_id,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_method,
      metadata: {
        user,
        plan,
      },
    });

    if (!response) {
      throw new InternalServerError("failed to create subscription");
    }

    return {
      subscription_id: response.id,
      subscription_end_date: response.current_period_end,
    };
  }

  async updateSubscription(args: StripeUpdateSubscriptionInput): Promise<StripeUpdateSubscriptionOutput> {
    const { subscription_id, order_id } = args;

    const response = await stripe.subscriptions.update(subscription_id, {
      metadata: {
        order_id,
      },
    });

    if (!response) {
      throw new InternalServerError("failed to update subscription");
    }

    return {
      isUpdated: response.id ? true : false,
    };
  }

  async accountWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    const endpointSecret =
      process.env.NODE_ENV === "dev"
        ? `${process.env.STRIPE_TEST_WEBHOOK_SECRET}`
        : `${process.env.STRIPE_PROD_WEBHOOK_SECRET}`;
    const sig = req.headers["stripe-signature"];
    let event;
    const rawBody = req.body.toString("utf8");

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err: any) {
      Res({
        res,
        code: StatusCodes.INTERNAL_SERVER,
        message: `webhook error: ${err.message}`,
      });
      return;
    }

    switch (event.type) {
      case "customer.created":
        const customer_created = event.data.object;

        await this.loggerService.log("successfully created stripe customer", {
          name: customer_created.name,
          email: customer_created.email,
        });

        break;
      case "customer.deleted":
        const customer_deleted = event.data.object;

        await this.loggerService.log("successfully deleted stripe customer", {
          id: customer_deleted.id,
        });

        break;
      case "customer.updated":
        const customer_updated = event.data.object;

        await this.loggerService.log("successfully updated stripe customer", {
          name: customer_updated.name,
          email: customer_updated.email,
        });
        break;
      case "customer.subscription.created":
        const { id, current_period_end, current_period_start, items, metadata } = event.data.object;

        const response = await this.subscriptionRepository.create({
          user: await this.database.convertStringToObjectId(metadata.user),
          plan: await this.database.convertStringToObjectId(metadata.plan),
          stripe_subscription_id: id,
          status: SubscriptionStatus.ACTIVE,
          start_date: new Date(current_period_start),
          end_date: new Date(current_period_end),
          amount: Number(items.data[0].plan.amount).toString(),
        });

        if (!response) {
          throw new InternalServerError("failed to add subscription to records", {
            name: customer_updated.name,
            email: customer_updated.email,
          });
        }

        await this.loggerService.log("successfully subscribed customer to a plan", {
          name: customer_updated.name,
          email: customer_updated.email,
        });
        break;
      case "customer.subscription.deleted":
        const {} = event.data.object;
        break;
      case "customer.subscription.updated":
        const {} = event.data.object;
        break;
      case "setup_intent.created":
        const {} = event.data.object;

        break;
      case "setup_intent.succeeded":
        const {} = event.data.object;

        break;
      case "setup_intent.setup_failed":
        const {} = event.data.object;
        break;
      case "payment_intent.created":
        const {} = event.data.object;
        break;
      case "payment_intent.payment_failed":
        const {} = event.data.object;
        break;
      case "payment_intent.succeeded":
        const {} = event.data.object;
        break;
      case "plan.created":
        const {} = event.data.object;
        break;
      case "plan.deleted":
        const {} = event.data.object;
        break;
      case "plan.updated":
        const {} = event.data.object;
        break;
      case "price.created":
        const {} = event.data.object;
        break;
      case "price.deleted":
        const {} = event.data.object;
        break;
      case "price.updated":
        const {} = event.data.object;
        break;
      case "subscription_schedule.canceled":
        const {} = event.data.object;
        break;
      case "subscription_schedule.completed":
        const {} = event.data.object;
        break;
      case "subscription_schedule.created":
        const {} = event.data.object;

        await this.loggerService.log("subscription plan will expire in 7 days");
        break;
      case "subscription_schedule.expiring":
        const {} = event.data.object;

        await this.loggerService.log("subscription plan will expire in 7 days");
        break;
      case "subscription_schedule.updated":
        const {} = event.data.object;
        break;
      default:
        Res({
          res,
          code: StatusCodes.INTERNAL_SERVER,
          message: `Unhandled event type: ${event.type}`,
        });
    }

    res.send();
  }
}
