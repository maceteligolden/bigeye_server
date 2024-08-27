import { injectable } from "tsyringe";
import axios from "axios";
import { stringify } from "flatted";
import { Message, SendPromptInput } from "./ai.interface";
import { ChatRepository, UserRepository } from "../../shared/repositories";
import { Chat } from "../../shared/entities";
import { BadRequestError } from "../../shared/errors";
import { Database } from "../../shared/facade";

@injectable()
export default class AIService {
  messages: Message[] | undefined = [];

  constructor(
    private chatRepository: ChatRepository,
    private userRepository: UserRepository,
    private database: Database,
  ) {}

  async sendPrompt(args: SendPromptInput): Promise<any> {
    if (!this.messages) {
      await this.getChat(args.chat_id);
    }

    const data = await axios.post("https://test.api.newtonslaw.net/ask-newton", {
      messages: [
        {
          content: args.message,
          role: "user",
        },
      ],
    });

    //TODO: save ai comment to db

    return stringify(data.data);
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
