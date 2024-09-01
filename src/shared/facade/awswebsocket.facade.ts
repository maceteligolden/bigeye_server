import { injectable } from "tsyringe";
import { WebsocketEvent } from "../constants";
import AWS from "aws-sdk";

@injectable()
export default class AWSWebsocket {
  constructor() {}

  async send(connectionId: string, event: WebsocketEvent, data: any): Promise<void> {
    try {
      const ws = new AWS.ApiGatewayManagementApi({
        endpoint: `${process.env.AWS_APIGATEWAY_WEBSOCKET}`,
      });

      await ws.postToConnection(
        {
          ConnectionId: connectionId,
          Data: JSON.stringify({ event, data }),
        },
        (err, data) => {
          if (err) {
            console.log("callback error: " + JSON.stringify(err));
          }

          if (data) {
            console.log("callback data: " + JSON.stringify(err));
          }
        },
      );
    } catch (err) {
      console.log("error: " + err);
    }
  }
}
