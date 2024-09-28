import { injectable } from "tsyringe";
import { DeleteOutput, IRepository } from "../interfaces";
import { Blog } from "../entities";
import { blogSchema } from "../schemas";

@injectable()
export default class BlogRepository implements IRepository<Blog> {
  constructor() {}
  async create(args: Blog): Promise<Blog> {
    return await blogSchema.create(args);
  }
  async fetchAll(): Promise<Blog[]> {
    return await blogSchema.find({});
  }
  async fetchOneById(id: string): Promise<Blog | null> {
    return await blogSchema.findOne({ _id: id });
  }
  async update(id: string, update: Partial<Blog>): Promise<Blog | null> {
    return await blogSchema.findByIdAndUpdate(id, update);
  }
  async delete(id: string): Promise<DeleteOutput> {
    return await blogSchema.deleteOne({ _id: id });
  }
}
