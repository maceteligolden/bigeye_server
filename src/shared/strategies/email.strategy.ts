import { injectable } from "tsyringe";
import { INotification } from "../interfaces";
import { AWSSQS } from "../facade";
import { SendEmailInput } from "../dto";

@injectable()
export default class EmailStrategy implements INotification {
  constructor(private awsSQS: AWSSQS) {}

  async send(args: SendEmailInput): Promise<void> {
    await this.awsSQS.queueMessage({
      message: args,
      queueurl: `${process.env.AWS_SQS_EMAIL_QUEUE_URL}`,
    });
  }
}
