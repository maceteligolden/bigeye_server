import { injectable } from "tsyringe";
import { Feature } from "../entities";
import { DeleteOutput, IRepository } from "../interfaces";

@injectable()
export default class FeatureRepository implements IRepository<Feature> {
    constructor(){
        
    }
    create(args: Feature): Promise<Feature> {
        throw new Error("Method not implemented.");
    }
    fetchAll(): Promise<Feature[]> {
        throw new Error("Method not implemented.");
    }
    fetchOneById(id: string): Promise<Feature | null> {
        throw new Error("Method not implemented.");
    }
    update(id: string, update: Partial<Feature>): Promise<Feature | null> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<DeleteOutput> {
        throw new Error("Method not implemented.");
    }
}