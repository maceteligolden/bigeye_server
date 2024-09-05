import { injectable } from "tsyringe";
import { AWSSNS } from "../../shared/facade";
import { BadRequestError } from "../../shared/errors";

@injectable()
export default class NotificationService {
    constructor(
        private awsSNS: AWSSNS
    ){

    }

    async testNotification(args: any): Promise<any> {

        const { user_id, device_token, message, subject } = args;

        const { EndpointArn } = await this.awsSNS.registerPhoneToken(user_id, device_token);

        if(!EndpointArn){
            throw new BadRequestError("failed to create endpoint arn")
        }

        await this.awsSNS.pushNotification({
            targetarn: EndpointArn,
            message,
            subject,
        })
    }
}