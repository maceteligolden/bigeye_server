import { injectable } from "tsyringe";
import { DeleteOutput, IRepository } from "../interfaces";
import { Transaction } from "../entities";
import { transactionSchema } from "../schemas";

@injectable()
export default class TransactionRepository implements IRepository<Transaction> {
  constructor() {}
  async create(args: Transaction): Promise<Transaction> {
    return await transactionSchema.create(args);
  }
  async fetchAll(): Promise<Transaction[]> {
    return await transactionSchema.find({})
  }
  async fetchOneById(id: string): Promise<Transaction | null> {
    return await transactionSchema.findOne({_id: id})
  }
  async update(id: string, update: Partial<Transaction>): Promise<Transaction | null> {
    return await transactionSchema.findByIdAndUpdate(id, update)
  }
  async updateByInvoiceId(id: string, update: Partial<Transaction>): Promise<any> {
    return await transactionSchema.updateOne({ invoice_id: id}, update)
  }
  updateBy(id: string, update: Partial<Transaction>): Promise<Transaction | null> {
    throw new Error("Method not implemented.");
  }
  async delete(id: string): Promise<DeleteOutput> {
    return await transactionSchema.deleteOne({_id: id})
  }
}
