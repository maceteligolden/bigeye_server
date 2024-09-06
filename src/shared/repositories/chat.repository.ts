import { injectable } from "tsyringe";
import { DeleteOutput, IRepository } from "../interfaces";
import { Chat } from "../entities";
import { chatSchema } from "../schemas";

@injectable()
export default class ChatRepository implements IRepository<Chat> {
  constructor() {}
  async create(args: Chat): Promise<Chat> {
    return await chatSchema.create(args);
  }
  async fetchAll(): Promise<Chat[]> {
    return await chatSchema.find({});
  }
  async fetchOneById(id: string): Promise<Chat | null> {
    return await chatSchema.findOne({ _id: id });
  }
  async update(id: string, update: Partial<Chat>): Promise<Chat | null> {
    return await chatSchema.findOneAndUpdate({ _id: id }, update);
  }
  async delete(id: string): Promise<DeleteOutput> {
    return await chatSchema.deleteOne({ _id: id });
  }

  async getChatsByUser(user_id: string): Promise<Chat[] | null> {
    return await chatSchema.find({ creator: user_id });
  }

  async getChatByTitle(title: string): Promise<Chat[] | null> {
    return await chatSchema.find({ title });
  }

  async addNewMessage(chat_id: string, message: string, role: "user" | "assistant"): Promise<Chat> {
    const chat = await chatSchema.findById(chat_id);

    if (!chat) {
      throw new Error("Chat not found");
    }

    if (chat.messages) {
      chat.messages.push({
        content: message,
        role,
      });
    } else {
      chat.messages = [
        {
          content: message,
          role,
        },
      ];
    }

    return await chat.save();
  }
}
