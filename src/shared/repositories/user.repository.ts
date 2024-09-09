import { injectable } from "tsyringe";
import { DeleteOutput, IRepository } from "../interfaces";
import { User } from "../entities";
import { userSchema } from "../schemas";
import { Database } from "../facade";
import { BadRequestError } from "../errors";
import { UserAccountStatus } from "../constants";

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
  async fetchOneByPaymentId(id: string): Promise<User | null> {
    return await userSchema.findOne({ stripe_card_id: id });
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
    } catch (err: any) {
      throw new BadRequestError("failed to update user");
    }
  }
  async updateWithCustomerId(customer_id: string, update: Partial<User>): Promise<User | null | undefined> {
    try {
      return await userSchema.findOneAndUpdate({ stripe_customer_id: customer_id }, update);
    } catch (err) {
      console.log(err);
    }
  }
  async delete(id: string): Promise<DeleteOutput> {
    throw new Error("Method not implemented.");
  }

  async deleteByCognitoId(id: string) {
    return await userSchema.deleteOne({ awscognito_user_id: id });
  }

  async clearCardDetails(user_id: string) {
    return await userSchema.findOneAndUpdate(
      { awscognito_user_id: user_id },
      {
        stripe_card_expire_date: "",
        stripe_card_id: "",
        stripe_card_last_digits: "",
        stripe_card_type: "",
      },
    );
  }

  async updateAccountStatus(customer_id: string, status: UserAccountStatus): Promise<User | null> {
    return await userSchema.findOneAndUpdate({ stripe_customer_id: customer_id }, { status });
  }

  async changeNotification(user_id: string, notification: boolean): Promise<User | null> {
    return await userSchema.findOneAndUpdate({
      awscognito_user_id: user_id
    }, {
      notification
    })
  }

  async updateDeviceToken(email: string, device_token: string): Promise<any> {
    return await userSchema.findOneAndUpdate({
      email
    }, {
      device_token
    })
  }

  async fetchAllByEmail(email: string): Promise<User | null> {
    return await userSchema.findOne({email})
  }
}
