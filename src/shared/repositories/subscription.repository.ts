import { injectable } from "tsyringe";
import { Subscription } from "../entities";
import { DeleteOutput, IRepository } from "../interfaces";
import { subscriptionSchema } from "../schemas";
import { SubscriptionStatus } from "../constants";

@injectable()
export default class SubscriptionRepository implements IRepository<Subscription> {
  constructor() {}
  async create(args: Subscription): Promise<Subscription> {
    return await subscriptionSchema.create(args);
  }
  async fetchAll(): Promise<Subscription[]> {
    return await subscriptionSchema.find({});
  }
  async fetchOneById(id: string): Promise<Subscription | null> {
    return await subscriptionSchema.findById(id);
  }
  async fetchByPriceId(id: string): Promise<Subscription | null> {
    return await subscriptionSchema.findOne({ plan: id });
  }
  async fetchOneStripeSub(id: string): Promise<Subscription | null> {
    return await subscriptionSchema.findOne({ stripe_subscription_id: id });
  }
  async fetchActiveByUserId(user_id: string): Promise<Subscription | null> {
    return await subscriptionSchema.findOne({ user: user_id, status: SubscriptionStatus.ACTIVE });
  }
  async update(id: string, update: Partial<Subscription>): Promise<Subscription | null> {
    return await subscriptionSchema.findOneAndUpdate({ _id: id }, update);
  }
  async updateByStripeSubId(id: string, update: Partial<Subscription>): Promise<Subscription | null> {
    return await subscriptionSchema.findOneAndUpdate({ stripe_subscription_id: id }, update);
  }
  async delete(id: string): Promise<DeleteOutput> {
    return await subscriptionSchema.deleteOne({_id: id})
  }
}
