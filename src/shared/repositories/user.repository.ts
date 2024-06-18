import { injectable } from "tsyringe";
import { DeleteOutput, IRepository } from "../interfaces";
import { User } from "../entities";
import { userSchema } from "../schemas";
import { Database } from "../facade";
import { BadRequestError } from "../errors";

@injectable()
export default class UserRepository implements IRepository<User> {
  constructor(private database: Database) {}
  async create(args: User): Promise<User> {
    return await userSchema.create(args);
  }
  fetchAll(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  async fetchOneById(id: string): Promise<User | null> {
    const ID = await this.database.convertStringToObjectId(id);
    return await userSchema.findOne({ _id: id });
  }
  async fetchOneByCustomerId(id: string): Promise<User | null> {
    return await userSchema.findOne({ stripe_customer_id: id });
  }
  async fetchOneByCognitoId(id: string): Promise<User | null> {
    try {
      return await userSchema.findOne({ awscognito_user_id: id });
    } catch (err: any) {
      throw new BadRequestError("user not found");
    }
  }
  async update(id: string, update: Partial<User>): Promise<User | null> {
    try {
      return await userSchema.findOneAndUpdate({ _id: id }, update);
    }catch(err: any){
      throw new BadRequestError("failed to update user");
    }
  }
  async updateWithCustomerId(customer_id: string, update: Partial<User>): Promise<User | null> {
    return await userSchema.findOneAndUpdate({ stripe_customer_id: customer_id }, update);
  }
  async delete(id: string): Promise<DeleteOutput> {
    throw new Error("Method not implemented.");
  }

  async deleteByCognitoId(id: string) {
    return await userSchema.deleteOne({ awscognito_user_id: id });
  }
}
