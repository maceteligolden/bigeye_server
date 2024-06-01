import { injectable } from "tsyringe";
import { IRepository } from "../interfaces";
import { Plan } from "../entities";
import { planSchema } from "../schemas";

@injectable()
export default class PlanRepository implements IRepository<Plan> {
  constructor() {}
  async create(args: Plan): Promise<Plan> {
    return await planSchema.create(args);
  }
  fetchAll(): Promise<Plan[]> {
    throw new Error("Method not implemented.");
  }
  async fetchOneById(id: string): Promise<Plan | null> {
    return await planSchema.findById(id);
  }
  async fetchOneByName(name: string): Promise<Plan | null> {
    return await planSchema.findOne({ name });
  }
  async update(id: string, update: Partial<Plan>): Promise<Plan | null> {
    return await planSchema.findOneAndUpdate({ _id: id }, update);
  }
  delete(id: string): Promise<Plan> {
    throw new Error("Method not implemented.");
  }
}
