import { injectable } from "tsyringe";
import { DeleteOutput, IRepository } from "../interfaces";
import { Plan } from "../entities";
import { planSchema } from "../schemas";

@injectable()
export default class PlanRepository implements IRepository<Plan> {
  constructor() {}
  async create(args: Plan): Promise<Plan> {
    return await planSchema.create(args);
  }
  async fetchAll(): Promise<Plan[]> {
    return await planSchema.find()
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
  async delete(id: string): Promise<DeleteOutput> {
    throw new Error("Method not implemented.");
  }
}
