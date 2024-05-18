import { injectable } from "tsyringe";
import { CloudWatchLogsClient, PutLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";

@injectable()
export default class AWSCloudWatch {
  private client: CloudWatchLogsClient;

  constructor() {
    this.client = new CloudWatchLogsClient({
      region: `${process.env.AWS_CLOUDWATCH_REGION}`,
      credentials: {
        accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
        secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
      },
    });
  }

  async sendLog(message: string, metadata?: {}) {
    const date = Number(Date.now());

    const events = metadata
      ? [
          {
            message,
            timestamp: date,
          },
          {
            message: JSON.stringify(metadata),
            timestamp: date,
          },
        ]
      : [
          {
            message,
            timestamp: date,
          },
        ];
    const command = new PutLogEventsCommand({
      logGroupName: `${process.env.AWS_CLOUDWATCH_LOGGROUPNAME}`,
      logStreamName: `${process.env.AWS_CLOUDWATCH_LOGSTREAMNAME}`,
      logEvents: events,
    });
    await this.client.send(command);
  }
}
