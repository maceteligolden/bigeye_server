import { injectable } from "tsyringe";
import { IRepository } from "../interfaces";
import { Plan } from "../entities";

@injectable()
export default class PlanRepository implements IRepository<Plan> {
  constructor() {}
  create(args: Plan): Promise<Plan> {
    throw new Error("Method not implemented.");
  }
  fetchAll(): Promise<Plan[]> {
    throw new Error("Method not implemented.");
  }
  fetchOneById(id: string): Promise<Plan> {
    throw new Error("Method not implemented.");
  }
  update(id: string, update: Partial<Plan>): Promise<Plan> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<Plan> {
    throw new Error("Method not implemented.");
  }
}
