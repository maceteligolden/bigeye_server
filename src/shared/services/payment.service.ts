import { injectable } from "tsyringe";
import { IPayment } from "../interfaces/payment.interface";
import { PaymentType } from "../dto";

@injectable()
export default class PaymentService {
  constructor() {}

  async pay(paymentMethod: IPayment, body: PaymentType): Promise<any> {
    paymentMethod.pay(body);
  }
}
