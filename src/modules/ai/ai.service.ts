import { injectable } from "tsyringe";
import axios from "axios";
import { stringify } from "flatted";
import { Message, SendPromptInput } from "./ai.interface";
import { ChatRepository, UserRepository, WebsocketRepository } from "../../shared/repositories";
import { Chat } from "../../shared/entities";
import { BadRequestError } from "../../shared/errors";
import { AWSWebsocket, Database } from "../../shared/facade";
import { WebsocketEvent } from "../../shared/constants";

@injectable()
export default class AIService {
  messages: Message[] | undefined = [];

  constructor(
    private chatRepository: ChatRepository,
    private userRepository: UserRepository,
    private websocketRepository: WebsocketRepository,
    private awsWebsocket: AWSWebsocket,
    private database: Database,
  ) {}

  async sendPrompt(args: SendPromptInput): Promise<any> {
    // if (!this.messages) {
    //   await this.getChat(args.chat_id);
    // }

    // const user = await this.userRepository.fetchOneByCognitoId(args.from);

    // if (!user) {
    //   throw new BadRequestError("failed to find user");
    // }

    const data = await axios.post("https://test.api.newtonslaw.net/ask-newton", {
      messages: [
        {
          content: args.message,
          role: "user",
        },
      ],
    });

    let stringObject = JSON.stringify(data.data);
   
    stringObject = stringObject.replace(/data:/g, '')
    // const json_form = this.extractContent(stringObject)
    console.log("data: " + typeof JSON.parse(stringObject))
    console.log("id: " + JSON.parse(stringObject)["id"])
    // console.log("json: " + json_form)
    // await this.chatRepository.addNewMessage(args.chat_id, args.message, "user");

    // let response = stringify(data.data);

    // const response_content = await this.extractContent(response);

    // console.log(response);

    //TODO: save ai comment to db
    // const websocket = await this.websocketRepository.getConnectionId(user._id!);

    // if (!websocket) {
    //   throw new BadRequestError("failed to find user connection id");
    // }

    // this.awsWebsocket.send(websocket.connectionId!, WebsocketEvent.MESSAGE, response_content);
  }

  stringToJSON(str: string) {
    const jsonObject: any = {};
    const pairs = str.split(','); // Split by commas to get individual key-value pairs
    
    pairs.forEach(pair => {
        console.log("pair: " + pair)
        const [key, value] = pair.split(':'); // Split each pair by colon
        const trimmedKey = key.trim(); // Trim any extra spaces around the key
        const trimmedValue = value.trim(); // Trim any extra spaces around the value
        
        jsonObject[trimmedKey] = trimmedValue; // Add the key-value pair to the JSON object
    });
    
    return jsonObject;
}

  extractContent(inputString: string): string | null {
    const match = inputString.match(/"content":\s"([^"]*)"/);
    console.log("match: " + match)
    if (match && match[1]) {
        // Return the extracted content with the surrounding quotes removed
        return match[1];
    } else {
        // Return null if the pattern is not found
        return null;
    }
  }

}
