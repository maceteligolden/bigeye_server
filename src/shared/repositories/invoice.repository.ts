import { injectable } from "tsyringe";
import { Invoice } from "../entities";
import { DeleteOutput, IRepository } from "../interfaces";

@injectable()
export default class InvoiceRepository implements IRepository<Invoice> {
    constructor() {

    }

    create(args: Invoice): Promise<Invoice> {
        throw new Error("Method not implemented.");
    }
    fetchAll(): Promise<Invoice[]> {
        throw new Error("Method not implemented.");
    }
    fetchOneById(id: string): Promise<Invoice | null> {
        throw new Error("Method not implemented.");
    }
    fetchOneByStripeId(id: string): Promise<Invoice | null> {
        throw new Error("Method not implemented.");
    }
    update(id: string, update: Partial<Invoice>): Promise<Invoice | null> {
        throw new Error("Method not implemented.");
    }
    updateByStripeSub(id: string, update: Partial<Invoice>): Promise<Invoice | null> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<DeleteOutput> {
        throw new Error("Method not implemented.");
    }
    
}