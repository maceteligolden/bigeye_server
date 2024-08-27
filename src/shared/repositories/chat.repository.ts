import { injectable } from "tsyringe";
import { DeleteOutput, IRepository } from "../interfaces";
import { Chat } from "../entities";

@injectable()
export default class ChatRepository implements IRepository<Chat> {
  constructor() {}
  create(args: Chat): Promise<Chat> {
    throw new Error("Method not implemented.");
  }
  fetchAll(): Promise<Chat[]> {
    throw new Error("Method not implemented.");
  }
  fetchOneById(id: string): Promise<Chat | null> {
    throw new Error("Method not implemented.");
  }
  update(id: string, update: Partial<Chat>): Promise<Chat | null> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<DeleteOutput> {
    throw new Error("Method not implemented.");
  }
}
