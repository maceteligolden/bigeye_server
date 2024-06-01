import { FileManager } from "../entities";
import { IRepository } from "../interfaces";
import { filemanagerSchema } from "../schemas";

export default class FileRepository implements IRepository<FileManager> {
  constructor() {}
  async create(args: FileManager): Promise<FileManager> {
    return await filemanagerSchema.create(args);
  }
  fetchAll(): Promise<FileManager[]> {
    throw new Error("Method not implemented.");
  }
  async fetchOneById(id: string): Promise<FileManager | null> {
    return await filemanagerSchema.findOne({ _id: id });
  }
  async update(id: string, update: Partial<FileManager>): Promise<FileManager | null> {
    return await filemanagerSchema.findOneAndUpdate({ _id: id }, update);
  }
  delete(id: string): Promise<FileManager> {
    throw new Error("Method not implemented.");
  }
}
