import { injectable } from "tsyringe";
import { Site } from "../entities";
import { DeleteOutput, IRepository } from "../interfaces";
import { siteSchema } from "../schemas";

@injectable()
export default class SiteRepository implements IRepository<Site> {
    constructor(){
        
    }
    async create(args: Site): Promise<Site> {
        return await siteSchema.create(args);
    }
    async fetchAll(): Promise<Site[]> {
        return await siteSchema.find({})
    }
    async fetchOneById(id: string): Promise<Site | null> {
        return await siteSchema.findOne({_id: id})
    }
    async update(id: string, update: Partial<Site>): Promise<Site | null> {
        return await siteSchema.findByIdAndUpdate(id, update);
    }
    async delete(id: string): Promise<DeleteOutput> {
        return await siteSchema.deleteOne({_id: id})
    }
    async fetchOneByName(name: string): Promise<Site | null> {
        return await siteSchema.findOne({name});
    }
    async fetchAllByUserId(id: string): Promise<Site[]> {
        return await siteSchema.find({user_id: id});
    }
}