import { injectable } from "tsyringe";
import { Subscription } from "../entities";
import { IRepository } from "../interfaces";

@injectable()
export default class SubscriptionRepository implements IRepository<Subscription> {
  constructor() {}
  create(args: Subscription): Promise<Subscription> {
    throw new Error("Method not implemented.");
  }
  fetchAll(): Promise<Subscription[]> {
    throw new Error("Method not implemented.");
  }
  fetchOneById(id: string): Promise<Subscription> {
    throw new Error("Method not implemented.");
  }
  fetchOnebyUserId(userId: string): Promise<Subscription> {
    throw new Error("Method not implemented");
  }
  update(id: string, update: Partial<Subscription>): Promise<Subscription> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<Subscription> {
    throw new Error("Method not implemented.");
  }
}
