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
const stripe = require("stripe")(`sk_test_51PJSmMD8tDGhrOdHek2V30Klg2aau40zdSWitlpJW7GVvNGBxiREgn0PlL7lKpWDtGOtjioUMsJwxwyj2XwCAkAZ00pR4is6Yc`);

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
}
