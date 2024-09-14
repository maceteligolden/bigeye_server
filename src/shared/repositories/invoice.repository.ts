import { injectable } from "tsyringe";
import { Invoice } from "../entities";
import { DeleteOutput, IRepository } from "../interfaces";
import { invoiceSchema } from "../schemas";

@injectable()
export default class InvoiceRepository implements IRepository<Invoice> {
    constructor() {

    }

    async create(args: Invoice): Promise<Invoice> {
       return await invoiceSchema.create(args)
    }
    async fetchAll(): Promise<Invoice[]> {
        return await invoiceSchema.find({})
    }
    async fetchOneById(id: string): Promise<Invoice | null> {
        return await invoiceSchema.findOne({_id: id})
    }
    async fetchOneByStripeId(id: string): Promise<Invoice | null> {
       return await invoiceSchema.findOne({ stripe_invoice_id: id})
    }
    async update(id: string, update: Partial<Invoice>): Promise<Invoice | null> {
        return await invoiceSchema.findByIdAndUpdate(id, update)
    }
    async updateByStripeId(id: string, update: Partial<Invoice>): Promise<any> {
        return await invoiceSchema.updateOne({_id: id}, update);
    }
    async delete(id: string): Promise<DeleteOutput> {
       return await invoiceSchema.deleteOne({_id: id});
    }
    
}