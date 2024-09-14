import { injectable } from "tsyringe";
import { AWSSNS } from "../../shared/facade";
import { UserRepository } from "../../shared/repositories";

@injectable()
export default class NotificationService {
  constructor(
    private awsSNS: AWSSNS,
    private userRepository: UserRepository,
  ) {}

  async testNotification(args: any): Promise<any> {
    const { user_id, device_token, message, subject } = args;

    // const { EndpointArn } = await this.awsSNS.registerPhoneToken(user_id, device_token);

    // console.log("endpoint: " + EndpointArn)

    // if (!EndpointArn) {
    //   throw new BadRequestError("failed to create endpoint arn");
    // }

    await this.awsSNS.pushNotification({
      targetarn: "",
      message,
      subject,
    });
  }

  async updateNotification(aws_id: string, notification: boolean): Promise<any> {
    return await this.userRepository.changeNotification(aws_id, notification);
  }
}
