import { injectable } from "tsyringe";
import { IPayment } from "../interfaces/payment.interface";
import Stripe from "../facade/stripe.facade";
import { PaymentIntentInput } from "../dto";

@injectable()
export default class StripeStrategy implements IPayment {
  constructor(private stripeHelper: Stripe) {}

  async pay(args: PaymentIntentInput): Promise<void> {
    const { customer, amount, payment_method } = args;
    await this.stripeHelper.setupIntent({ customer });

    const { charge_id } = await this.stripeHelper.paymentIntent({
      customer,
      amount,
      payment_method,
    });

    await this.stripeHelper.paymentConfirm({ id: charge_id, payment_id: payment_method });
  }
}
