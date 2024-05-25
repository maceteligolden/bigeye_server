import { injectable } from "tsyringe";
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
import { StripeCurriencies, StripePaymentMethodType } from "../constants";
import { StripeHelper } from "../helper";
const stripe = require("stripe")(`${process.env.STRIPE_API_KEY}`);

@injectable()
export default class Stripe {
  constructor(private stripeHelper: StripeHelper) {}

  async setupIntent(args: SetupIntentInput): Promise<SetupIntentOutput> {
    const { customer } = args;
    const { client_secret } = await stripe.setupIntents.create({
      customer,
      payment_method_types: [StripePaymentMethodType.CARD],
    });

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

    return {
      charge_id: id,
    };
  }

  async paymentConfirm(args: PaymentConfirmInput): Promise<void> {
    const { id, payment_id } = args;

    await stripe.paymentIntents.confirm(id, { payment_method: payment_id });
  }

  async createCustomer(args: CreateCustomerInput): Promise<CreateCustomerOutput> {
    const { email, name } = args;
    const customer = await stripe.customers.create({
      email,
      name,
    });

    return {
      customer_id: customer.id,
    };
  }

  async deleteCustomer(args: DeleteCustomerInput): Promise<DeleteCustomerOutput> {
    const { customer_id } = args;
    const response = await stripe.customers.del(customer_id);
    return {
      isDeleted: response.deleted,
    };
  }

  async deleteCard(payment_method_id: string): Promise<void> {
    await stripe.paymentMethods.detach(payment_method_id);
  }

  async fetchCardDetails(args: FetchCardDetailsInput): Promise<FetchCardDetailsOutput> {
    const { payment_method_id } = args;

    const { card } = await stripe.paymentMethods.retrieve(payment_method_id);

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

    const response = await stripe.plans.create({
      amount: Number(amount),
      currency: "usd",
      interval: "month",
      product,
    });
    return {
      plan_id: response.id,
      price_id: id,
    };
  }

  async deletePlan(args: StripeDeletePlanInput): Promise<StripeDeletePlanOutput> {
    const { plan_id } = args;

    const response = await stripe.plans.del(plan_id);

    return {
      isPlanDeleted: response.deleted,
    };
  }

  async createSubscription(args: StripeCreateSubscriptionInput): Promise<StripeCreateSubscriptionOutput> {
    const { customer_id, price_id, payment_method } = args;

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
    });
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

    return {
      isUpdated: response.id ? true : false,
    };
  }
}
