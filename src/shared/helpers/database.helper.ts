import { injectable } from "tsyringe";
import { IDatabase } from "../interfaces";
import mongoose from "mongoose";
import { LoggerService } from "../services";

@injectable()
export default class Database implements IDatabase {
    constructor(private loggerService: LoggerService){

    }
    connect(): void {
        const DATABASE_URL = process.env.DATABASE_URL;
        mongoose.set("strictQuery", false);
        mongoose.connect(`${DATABASE_URL}`).then((res: any) => {
            this.loggerService.log("Successfully connected to database");
        }).catch((err)=> {
            this.loggerService.log(err);
        });
    }
    disconnect(): void {
        mongoose.disconnect();
    }


}