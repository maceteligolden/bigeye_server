import { injectable } from "tsyringe";
import {
  CreateCustomerInput,
  CreateCustomerOutput,
  FetchCardDetailsInput,
  FetchCardDetailsOutput,
  PaymentConfirmInput,
  PaymentIntentInput,
  PaymentIntentOutput,
  SetupIntentInput,
  SetupIntentOutput,
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
}
