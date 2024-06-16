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
import { LoggerService } from "../services";
import { InternalServerError } from "../errors";
const stripe = require("stripe")(
  `${process.env.STRIPE_API_KEY}`
);

@injectable()
export default class Stripe {
  constructor(
    private stripeHelper: StripeHelper,
    private loggerService: LoggerService
  ) {}

  async setupIntent(args: SetupIntentInput): Promise<SetupIntentOutput> {
    try {
      const { customer } = args;
      const { client_secret } = await stripe.setupIntents.create({
        customer,
        payment_method_types: [StripePaymentMethodType.CARD],
      });

      return {
        client_secret
      };
    } catch(err){
      throw new InternalServerError("failed setupintent attempt")
    }
  }

  async paymentIntent(args: PaymentIntentInput): Promise<PaymentIntentOutput> {
    try {
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
    } catch(err: any){
      throw new InternalServerError("failed paymentintent attempt")
    }
  }

  async paymentConfirm(args: PaymentConfirmInput): Promise<void> {
    try {
      const { id, payment_id } = args;

      const response = await stripe.paymentIntents.confirm(id, { payment_method: payment_id });
  
      if (!response) {
        throw new InternalServerError("failed to confirm payment");
      }
    } catch(err: any){
      throw new InternalServerError("failed paymentconfirm attempt")
    }
  }

  async createCustomer(args: CreateCustomerInput): Promise<CreateCustomerOutput> {
    try {
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
    } catch(err: any){
      throw new InternalServerError("failed attempt to create stripe customer account")
    }
  }

  async deleteCustomer(args: DeleteCustomerInput): Promise<DeleteCustomerOutput> {
    try {
      const { customer_id } = args;
      const response = await stripe.customers.del(customer_id);
  
      if (!response) {
        throw new InternalServerError("failed to delete customer");
      }
  
      return {
        isDeleted: response.deleted,
      };
    } catch(err : any){
      throw new InternalServerError("failed attempt to delete stripe customer account")
    }
  }

  async deleteCard(payment_method_id: string): Promise<void> {
    try {
      const response = await stripe.paymentMethods.detach(payment_method_id);

      if (!response) {
        throw new InternalServerError("failed to delete card");
      }
    }catch(err){
      throw new InternalServerError("failed attempt to delete card from stripe")
    }
  }

  async fetchCardDetails(args: FetchCardDetailsInput): Promise<FetchCardDetailsOutput> {
    try {
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
    }catch(err: any){
      throw new InternalServerError("failed attempt to delete card from stripe")
    }
  }

  async createPlan(args: StripeCreatePlanInput): Promise<StripeCreatePlanOutput> {
    try {
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
    }catch(err: any){
      throw new InternalServerError("failed attempt to create plan")
    }
  }

  async deletePlan(args: StripeDeletePlanInput): Promise<StripeDeletePlanOutput> {
    try {
      const { plan_id } = args;

      const response = await stripe.plans.del(plan_id);

      if (!response) {
        throw new InternalServerError("failed to delete plan");
      }

      return {
        isPlanDeleted: response.deleted,
      };
    }catch(err: any){
      throw new InternalServerError("failed attempt to delete plan")
    }
  }

  async createSubscription(args: StripeCreateSubscriptionInput): Promise<StripeCreateSubscriptionOutput> {
     try { 
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
    }catch(err: any){
      throw new InternalServerError("failed attempt to create subscription")
    }
  }

  async updateSubscription(args: StripeUpdateSubscriptionInput): Promise<StripeUpdateSubscriptionOutput> {
    try {
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
    }catch(err: any){
      throw new InternalServerError("failed attempt to update subscription")
    }
  }
}
