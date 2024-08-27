import { injectable } from "tsyringe";
import { DeleteOutput, IRepository } from "../interfaces";
import { FileManager } from "../entities";
import { filemanagerSchema } from "../schemas";
import { InternalServerError } from "../errors";

@injectable()
export default class FileManagerRepository implements IRepository<FileManager> {
  constructor() {}
  async create(args: FileManager): Promise<FileManager> {
    return await filemanagerSchema.create(args);
  }
  fetchAll(): Promise<FileManager[]> {
    throw new Error("Method not implemented.");
  }
  async fetchAllByUserId(user_id: string, skip: number, limit: number, folder?: string): Promise<FileManager[]> {
    try {
      if (folder) {
        return await filemanagerSchema.find({ user: user_id, parent: folder }).skip(skip).limit(limit);
      } else {
        return await filemanagerSchema.find({ user: user_id }).skip(skip).limit(limit);
      }
    } catch (err: any) {
      throw new InternalServerError("failed to fetch all user objects");
    }
  }
  async fetchHomeByUserId(user_id: string, skip: number, limit: number, folder?: string): Promise<FileManager[]> {
    try {
      if (folder) {
        return await filemanagerSchema.find({ user: user_id, parent: folder }).skip(skip).limit(limit);
      } else {
        return await filemanagerSchema.find({ user: user_id, parent: undefined }).skip(skip).limit(limit);
      }
    } catch (err: any) {
      throw new InternalServerError("failed to fetch all user objects");
    }
  }
  async totalObjectByUser(user_id: string, folder?: string): Promise<number> {
    try {
      if (folder) {
        return await filemanagerSchema.countDocuments({ user: user_id, parent: folder }).exec();
      } else {
        return await filemanagerSchema.countDocuments({ user: user_id }).exec();
      }
    } catch (err: any) {
      throw new InternalServerError("failed to get total object count for user");
    }
  }
  async fetchObjectByName(name: string, user_id: string): Promise<FileManager | null> {
    const response = await filemanagerSchema.findOne({
      name,
      user: user_id,
    });

    return response;
  }
  async fetchOneById(id: string): Promise<FileManager | null> {
    return await filemanagerSchema.findOne({ _id: id });
  }
  async fetchAllByParent(id: string): Promise<FileManager[]> {
    return await filemanagerSchema.find({ parent: id });
  }
  async update(id: string, update: Partial<FileManager>): Promise<FileManager | null> {
    return await filemanagerSchema.findOneAndUpdate({ _id: id }, update);
  }
  async delete(id: string): Promise<DeleteOutput> {
    return await filemanagerSchema.deleteOne({ _id: id });
  }
  async deleteMany(ids: string[]): Promise<any> {
    return await filemanagerSchema.deleteMany({ _id: { $in: ids } });
  }
  async deleteManyByUserId(user_id: string): Promise<any> {
    return await filemanagerSchema.deleteMany({ user: user_id });
  }
}
