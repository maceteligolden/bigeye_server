import { injectable } from "tsyringe";
import { DeleteOutput, IRepository } from "../interfaces";
import { Plan } from "../entities";
import { planSchema } from "../schemas";
import { InternalServerError } from "../errors";
import { Schema, Types } from "mongoose";

@injectable()
export default class PlanRepository implements IRepository<Plan> {
  constructor() {}
  async create(args: Plan): Promise<Plan> {
    return await planSchema.create(args);
  }
  async fetchAll(): Promise<Plan[]> {
    return await planSchema.find();
  }
  async fetchOneById(id: string): Promise<Plan | null> {
    return await planSchema.findById(id);
  }
  async fetchById(id: Types.ObjectId | undefined): Promise<Plan | null> {
    try {
      return await planSchema.findOne({ _id: id });
    } catch (err: any) {
      throw new InternalServerError(err);
    }
  }
  async fetchOneByName(name: string): Promise<Plan | null> {
    return await planSchema.findOne({ name });
  }
  async fetchOneByStripePlanId(id: string): Promise<Plan | null> {
    return await planSchema.findOne({ stripe_price_id: id });
  }
  async update(id: string, update: Partial<Plan>): Promise<Plan | null> {
    return await planSchema.findOneAndUpdate({ _id: id }, update);
  }
  async delete(id: string): Promise<DeleteOutput> {
    throw new Error("Method not implemented.");
  }
}
