import { injectable } from "tsyringe";
import { Feature } from "../entities";
import { DeleteOutput, IRepository } from "../interfaces";
import { featureSchema } from "../schemas";

@injectable()
export default class FeatureRepository implements IRepository<Feature> {
  constructor() {}
  async create(args: Feature): Promise<Feature> {
    return await featureSchema.create(args);
  }
  async fetchAll(): Promise<Feature[]> {
    return await featureSchema.find({})
  }
  async fetchAllByPlan(plan_id: string):Promise<Feature[]> {
    return await featureSchema.find({plan_id})
  }
  async fetchOneById(id: string): Promise<Feature | null> {
    return await featureSchema.findOne({_id: id})
  }
  async update(id: string, update: Partial<Feature>): Promise<Feature | null> {
    return await featureSchema.findByIdAndUpdate(id, update)
  }
  async delete(id: string): Promise<DeleteOutput> {
    return await featureSchema.deleteOne({_id: id})
  }
}
