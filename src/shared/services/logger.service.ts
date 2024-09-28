import { injectable } from "tsyringe";
import { ILogger } from "../interfaces";
import { AWSCloudWatch } from "../facade";

@injectable()
export default class LoggerService implements ILogger {
  constructor(private awsCloudWatch: AWSCloudWatch) {}

  async log(message: string, metadata?: {}): Promise<void> {
    console.log(message);
  }
}
