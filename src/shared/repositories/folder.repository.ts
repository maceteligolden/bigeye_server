import { injectable } from "tsyringe";
import { FileManager } from "../entities";
import { DeleteOutput, IRepository } from "../interfaces";
import { filemanagerSchema } from "../schemas";
import { FileManagerObjectTypes } from "../constants";

@injectable()
export default class FolderRepository implements IRepository<FileManager> {
  constructor() {}
  async create(args: FileManager): Promise<FileManager> {
    return await filemanagerSchema.create(args);
  }
  fetchAll(): Promise<FileManager[]> {
    throw new Error("Method not implemented.");
  }
  async fetchAllById(id: string): Promise<FileManager[]> {
    return await filemanagerSchema.find({ _id: id });
  }
  async fetchOneById(id: string): Promise<FileManager | null> {
    return await filemanagerSchema.findOne({ _id: id });
  }
  async fetchFoldersByName(name: string, user_id: string): Promise<FileManager | null> {
    const response = await filemanagerSchema.findOne({
      name,
      user: user_id,
      object_type: FileManagerObjectTypes.FOLDER,
    });

    return response;
  }
  async update(id: string, update: Partial<FileManager>): Promise<FileManager | null> {
    return await filemanagerSchema.findOneAndUpdate({ _id: id }, update);
  }
  async delete(id: string): Promise<DeleteOutput> {
    return await filemanagerSchema.deleteOne({ _id: id });
  }
}
