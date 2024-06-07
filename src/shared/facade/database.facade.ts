import { injectable } from "tsyringe";
import { IDatabase } from "../interfaces";
import mongoose from "mongoose";
import { LoggerService } from "../services";
import { InternalServerError } from "../errors";

@injectable()
export default class Database implements IDatabase {
  constructor(private loggerService: LoggerService) {}
  connect(): void {
    const DATABASE_URL = process.env.DATABASE_URL;
    mongoose.set("strictQuery", false);
    mongoose
      .connect(`${DATABASE_URL}`)
      .then((res: any) => {
        this.loggerService.log("Successfully connected to database");
      })
      .catch((err) => {
        throw new InternalServerError("failed to connect to database");
      });
  }
  disconnect(): void {
    mongoose.disconnect();
  }

  convertStringToObjectId(id: string) {
    return new mongoose.Types.ObjectId(id);
  }
}
