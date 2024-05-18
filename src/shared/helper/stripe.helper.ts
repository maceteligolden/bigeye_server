import { injectable } from "tsyringe";

@injectable()
export default class StripeHelper {
  private BASE = 100;
  constructor() {}

  currencyConverter(amount: number): number {
    return Number(amount * this.BASE);
  }

  currencyReconverter(amount: number): string {
    return (Number(amount) / this.BASE).toString();
  }
}
