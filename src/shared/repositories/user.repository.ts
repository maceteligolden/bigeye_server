import { injectable } from "tsyringe";
import { IRepository } from "../interfaces";
import { User } from "../entities";

@injectable()
export default class UserRepository implements IRepository<User> {
  constructor() {}
  create(args: User): Promise<User> {
    throw new Error("add user to mongodb table");
  }
  fetchAll(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  fetchOneById(id: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  fetchOneByCustomerId(id: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  update(id: string, update: Partial<User>): Promise<User> {
    throw new Error("Method not implemented.");
  }
  updateWithCustomerId(customer_id: string, update: Partial<User>): Promise<User> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
}
