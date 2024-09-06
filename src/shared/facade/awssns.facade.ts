import { injectable } from "tsyringe";
import { CreatePlatformEndpointCommand, PublishCommand, SNSClient, SubscribeCommand } from "@aws-sdk/client-sns";
import { LoggerService } from "../services";
import { AWSServices } from "../constants";
import { PushNotificationInput } from "../dto";

@injectable()
export default class AWSSNS {
  private client: SNSClient;

  constructor(private loggerService: LoggerService) {
    this.client = new SNSClient({
      region: `${process.env.AWS_SNS_REGION}`,
      credentials: {
        accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
        secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
      },
    });
  }

  async registerPhoneToken(user_id: string, token: string): Promise<any> {
    const input = {
      PlatformApplicationArn: `${process.env.AWS_SNS_PLATFORM_APPLICATION_ARN}`,
      Token: token,
      CustomUserData: user_id,
    };
    const command = new CreatePlatformEndpointCommand(input);
    return await this.client.send(command);
  }

  async pushNotification(args: PushNotificationInput): Promise<void> {
    const input = {
      TargetArn: args.targetarn,
      Message: args.message,
      Subject: args.subject,
    };
    const command = new PublishCommand(input);
    await this.client.send(command);
  }

  async subscribeNotification(topicarn: string) {
    const input = {
      TopicArn: topicarn,
      Protocol: `${AWSServices.SQS}`,
      Endpoint: `${process.env.AWS_SNS_ENDPOINT_GENERAL}`,
    };
    const command = new SubscribeCommand(input);
    await this.client.send(command);
  }
}
