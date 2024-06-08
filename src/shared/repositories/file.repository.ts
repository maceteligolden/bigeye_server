import { FileManager } from "../entities";
import { InternalServerError } from "../errors";
import { DeleteOutput, IRepository } from "../interfaces";
import { filemanagerSchema } from "../schemas";

export default class FileRepository implements IRepository<FileManager> {
  constructor() {}
  async create(args: FileManager): Promise<FileManager> {
    try {
    return await filemanagerSchema.create(args);
    } catch(err: any) {
      throw new InternalServerError("failed to upload file(s)");
    }
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
  async delete(id: string): Promise<DeleteOutput> {
    throw new Error("Method not implemented.");
  }
}
