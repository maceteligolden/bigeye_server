export interface IPayment {
  pay(args: Record<string, any>): Promise<any>;
}
