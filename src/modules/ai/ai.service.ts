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

    const user = await this.userRepository.fetchOneByCognitoId(args.from);

    if (!user) {
      throw new BadRequestError("failed to find user");
    }

    const data = await axios.post("https://test.api.newtonslaw.net/ask-newton", {
      messages: [
        {
          content: args.message,
          role: "user",
        },
      ],
    });

    // await this.chatRepository.addNewMessage(args.chat_id, args.message, "user");

    let response = stringify(data.data);

    const response_content = await this.extractContent(response);

    console.log(response_content);

    //TODO: save ai comment to db
    const websocket = await this.websocketRepository.getConnectionId(user._id!);

    if (!websocket) {
      throw new BadRequestError("failed to find user connection id");
    }

    this.awsWebsocket.send(websocket.connectionId!, WebsocketEvent.MESSAGE, response_content);
  }

  extractContent(jsonString: string): string[] {
    const contents: string[] = [];

    // First, let's clean up and parse the JSON string
    const cleanedString = jsonString.replace(/\\"/g, '"').replace(/\\n/g, "\n");
    const dataObjects = JSON.parse(cleanedString);

    // Traverse the dataObjects to find content
    dataObjects.forEach((data: any) => {
      if (data.choices) {
        data.choices.forEach((choice: any) => {
          if (choice.delta && choice.delta.content) {
            contents.push(choice.delta.content);
          }
        });
      }
    });

    return contents;
  }

  async getChat(chat_id: string): Promise<Chat> {
    const chat = await this.chatRepository.fetchOneById(chat_id);

    if (!chat) {
      throw new BadRequestError("failed to fetch chat");
    }

    this.messages = chat.messages;

    return chat;
  }

  async createChat(title: string, aws_id: string): Promise<Chat> {
    const user = await this.userRepository.fetchOneByCognitoId(aws_id);

    if (!user) {
      throw new BadRequestError("failed to find user");
    }

    return await this.chatRepository.create({
      title,
      creator: await this.database.convertStringToObjectId(user._id!),
    });
  }

  async renameChat(title: string, chat_id: string): Promise<boolean> {
    const renamedChat = await this.chatRepository.update(chat_id, {
      title,
    });

    if (!renamedChat) {
      throw new BadRequestError("failed to rename chat");
    }

    return true;
  }

  async deleteChat(chat_id: string): Promise<boolean> {
    const isDeleted = await this.chatRepository.delete(chat_id);

    if (!isDeleted) {
      throw new BadRequestError("failed to delete chat");
    }

    return true;
  }
}
