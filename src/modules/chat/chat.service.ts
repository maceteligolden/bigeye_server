import { injectable } from "tsyringe";
import { ChatRepository, UserRepository } from "../../shared/repositories";
import { Chat } from "../../shared/entities";
import { Database } from "../../shared/facade";
import { BadRequestError } from "../../shared/errors";

@injectable()
export default class ChatService {
  constructor(
    private database: Database,
    private chatRepository: ChatRepository,
    private userRepository: UserRepository,
  ) {}

  async createChat(title: string, creator: string): Promise<Chat> {
    const user = await this.userRepository.fetchOneByCognitoId(creator);

    if (!user) {
      throw new BadRequestError("failed to find user");
    }

    const checkTitle = await this.chatRepository.getChatByTitle(title);

    if (!checkTitle) {
      throw new BadRequestError("chat title already taken");
    }

    return await this.chatRepository.create({
      title,
      creator: await this.database.convertStringToObjectId(user._id!),
    });
  }

  async getChats(user_id: string): Promise<Chat[] | null> {
    const user = await this.userRepository.fetchOneByCognitoId(user_id);

    if (!user) {
      throw new BadRequestError("failed to find user");
    }

    return await this.chatRepository.getChatsByUser(user._id!);
  }

  async getChat(chat_id: string): Promise<Chat | null> {
    return await this.chatRepository.fetchOneById(chat_id);
  }

  async renameChat(chat_id: string, title: string): Promise<Chat | null> {
    return await this.chatRepository.update(chat_id, {
      title,
    });
  }

  async deleteChat(chat_id: string): Promise<void> {
    await this.chatRepository.delete(chat_id);
  }
}
