import { injectable } from "tsyringe";
import { DeleteOutput, IRepository } from "../interfaces";
import { Transaction } from "../entities";

@injectable()
export default class TransactionRepository implements IRepository<Transaction> {
    constructor() {
        
    }
    create(args: Transaction): Promise<Transaction> {
        throw new Error("Method not implemented.");
    }
    fetchAll(): Promise<Transaction[]> {
        throw new Error("Method not implemented.");
    }
    fetchOneById(id: string): Promise<Transaction | null> {
        throw new Error("Method not implemented.");
    }
    update(id: string, update: Partial<Transaction>): Promise<Transaction | null> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<DeleteOutput> {
        throw new Error("Method not implemented.");
    }
}