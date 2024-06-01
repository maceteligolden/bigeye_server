import { injectable } from "tsyringe";
import { IRepository } from "../interfaces";
import { User } from "../entities";
import { userSchema } from "../schemas";

@injectable()
export default class UserRepository implements IRepository<User> {
  constructor() {}
  async create(args: User): Promise<User> {
    return await userSchema.create(args);
  }
  fetchAll(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  async fetchOneById(id: string): Promise<User | null> {
    return await userSchema.findById(id);
  }
  async fetchOneByCustomerId(id: string): Promise<User | null> {
    return await userSchema.findOne({ stripe_customer_id: id });
  }
  async update(id: string, update: Partial<User>): Promise<User | null> {
    return await userSchema.findOneAndUpdate({ _id: id }, update);
  }
  async updateWithCustomerId(customer_id: string, update: Partial<User>): Promise<User | null> {
    return await userSchema.findOneAndUpdate({ stripe_customer_id: customer_id }, update);
  }
  delete(id: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
}
