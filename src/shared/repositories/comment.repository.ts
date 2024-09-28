import { injectable } from "tsyringe";
import { DeleteOutput, IRepository } from "../interfaces";
import { commentSchema } from "../schemas";

@injectable()
export default class CommentRepository implements IRepository<Comment> {
  constructor() {}
  async create(args: Comment): Promise<any> {
    return await commentSchema.create(args);
  }
  async fetchAll(): Promise<Comment[]> {
    return await commentSchema.find({});
  }
  async fetchOneById(id: string): Promise<Comment | null> {
    return await commentSchema.findOne({ _id: id });
  }
  async update(id: string, update: Partial<Comment>): Promise<Comment | null> {
    return await commentSchema.findByIdAndUpdate(id, update);
  }
  async delete(id: string): Promise<DeleteOutput> {
    return await commentSchema.deleteOne({ _id: id });
  }
}
