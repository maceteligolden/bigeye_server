import { injectable } from "tsyringe";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { QueueMessageInput } from "../dto";

@injectable()
export default class AWSSQS {
  private client: SQSClient;

  constructor() {
    this.client = new SQSClient({
      region: `${process.env.AWS_SQS_REGION}`,
      credentials: {
        accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
        secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
      },
    });
  }

  async queueMessage(args: QueueMessageInput): Promise<void> {
    const params = {
      MessageBody: JSON.stringify(args.message),
      QueueUrl: `${args.queueurl}`,
    };

    const command = new SendMessageCommand(params);
    await this.client.send(command);
  }
}
