import { injectable } from "tsyringe";
import { Subscription } from "../entities";
import { IRepository } from "../interfaces";
import { subscriptionSchema } from "../schemas";

@injectable()
export default class SubscriptionRepository implements IRepository<Subscription> {
  constructor() {}
  async create(args: Subscription): Promise<Subscription> {
    return await subscriptionSchema.create(args);
  }
  fetchAll(): Promise<Subscription[]> {
    throw new Error("Method not implemented.");
  }
  async fetchOneById(id: string): Promise<Subscription | null> {
    return await subscriptionSchema.findById(id);
  }
  async update(id: string, update: Partial<Subscription>): Promise<Subscription | null> {
    return await subscriptionSchema.findOneAndUpdate({ _id: id }, update);
  }
  delete(id: string): Promise<Subscription> {
    throw new Error("Method not implemented.");
  }
}
