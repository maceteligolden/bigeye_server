import { injectable } from "tsyringe";
import { ILogger } from "../interfaces";

@injectable()
export default class LoggerService implements ILogger {
  constructor() {}

  log(message: string): void {
    console.log(message);
  }
}
