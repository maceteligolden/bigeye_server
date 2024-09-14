import { injectable } from "tsyringe";
import {
  CreatePlatformEndpointCommand,
  GetEndpointAttributesCommand,
  PublishCommand,
  SNSClient,
  SubscribeCommand,
} from "@aws-sdk/client-sns";
import { AWSServices } from "../constants";
import { PushNotificationInput } from "../dto";

@injectable()
export default class AWSSNS {
  private client: SNSClient;

  constructor() {
    this.client = new SNSClient({
      region: `${process.env.AWS_SNS_REGION}`,
      credentials: {
        accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
        secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
      },
    });
  }

  async registerPhoneToken(token: string): Promise<any> {
    const input = {
      PlatformApplicationArn: `${process.env.AWS_SNS_PLATFORM_APPLICATION_ARN}`,
      Token: token,
    };
    const command = new CreatePlatformEndpointCommand(input);
    return (await this.client.send(command)).EndpointArn;
  }

  async checkEnpointEnabled(endpointArn: string): Promise<boolean> {
    const command = new GetEndpointAttributesCommand({
      EndpointArn: endpointArn,
    });
    const response = await this.client.send(command);

    // The "Enabled" attribute is stored as a string: "true" or "false"
    return response.Attributes?.Enabled === "true" ? true : false;
  }

  async pushNotification(args: PushNotificationInput): Promise<void> {
    const messagePayload = {
      default: args.message,
      APNS: JSON.stringify({
        aps: {
          alert: {
            title: args.subject,
            body: args.message,
          },
          sound: "default",
          badge: 1,
          "mutable-content": 1,
          customData: {
            chat_id: args.meta_data?.chat_id,
            user_id: args.meta_data?.user_id,
          },
        },
      }),
      GCM: JSON.stringify({
        notification: {
          title: args.subject,
          body: args.message,
          sound: "default",
          icon: "ic_notification",
          click_action: "OPEN_ACTIVITY",
        },
        data: {
          chat_id: args.meta_data?.chat_id,
          user_id: args.meta_data?.user_id,
        },
      }),
    };
    const input = {
      TargetArn: args.targetarn,
      Message: JSON.stringify(messagePayload),
      MessageStructure: "json",
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
