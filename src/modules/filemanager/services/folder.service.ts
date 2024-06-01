import { injectable } from "tsyringe";
import {
  CreateFolderInput,
  CreateFolderOutput,
  DeleteFolderInput,
  RenameFolderInput,
  RenameFolderOutput,
} from "../dto";
import { FolderRepository } from "../../../shared/repositories";
import { BadRequestError, InternalServerError } from "../../../shared/errors";
import { FileManagerObjectTypes } from "../../../shared/constants";
import { IAction } from "../interfaces";
import { FileManager } from "../../../shared/entities";
import { Database } from "../../../shared/facade";

@injectable()
export default class FolderService implements IAction {
  constructor(private folderRepository: FolderRepository, private database: Database) {}

  async move(object_id: string, to: string): Promise<void> {
    const checkId = await this.folderRepository.fetchOneById(object_id);

    if (!checkId) {
      throw new BadRequestError("folder not found");
    }

    const checkDestination = await this.folderRepository.fetchOneById(to);

    if (!checkDestination) {
      throw new BadRequestError("destionation not found");
    }

    const moveObject = await this.folderRepository.update(object_id, {
      parent: await this.database.convertStringToObjectId(to),
    });

    if (!moveObject) {
      throw new BadRequestError("failed to move folder");
    }
  }
  async copy(object_id: string, to: string): Promise<void> {
    const checkId = await this.folderRepository.fetchOneById(object_id);

    if (!checkId) {
      throw new BadRequestError("folder not found");
    }

    const checkDestination = await this.folderRepository.fetchOneById(to);

    if (!checkDestination) {
      throw new BadRequestError("destionation not found");
    }

    const copyFolder = await this.folderRepository.create({
      name: checkId.name,
      object_type: checkId.object_type,
      user: checkId.user,
      parent: checkId.parent,
    });

    if (!copyFolder) {
      throw new BadRequestError("failed to copy folder");
    }

    const childobjects = await this.folderRepository.fetchAllById(object_id);

    childobjects.map(async (object: FileManager) => {
      await this.folderRepository.create({
        name: object.name,
        object_type: object.object_type,
        user: object.user,
        parent: await this.database.convertStringToObjectId(copyFolder._id!),
      });
    });
  }

  async createFolder(args: CreateFolderInput): Promise<CreateFolderOutput> {
    const { name, parent_folder_id } = args;

    this.checkFolderName(name);

    const addFolder = await this.folderRepository.create({
      name,
      parent: parent_folder_id ? await this.database.convertStringToObjectId(parent_folder_id) : undefined,
      object_type: FileManagerObjectTypes.FOLDER,
    });

    if (!addFolder) {
      throw new InternalServerError("failed to add folder");
    }

    return {
      isFolderCreated: true,
    };
  }

  async deleteFolder(args: DeleteFolderInput): Promise<void> {
    const { folder_id } = args;

    const checkId = await this.folderRepository.fetchOneById(folder_id);

    if (!checkId) {
      throw new BadRequestError("failed to provide folder id");
    }

    const deleteFolder = await this.folderRepository.delete(folder_id);

    if (!deleteFolder) {
      throw new InternalServerError("failed to delete folder");
    }
  }

  async renameFolder(args: RenameFolderInput): Promise<RenameFolderOutput> {
    const { name, folder_id } = args;

    this.checkFolderName(name);

    const renameFolder = await this.folderRepository.update(folder_id, {
      name,
    });

    if (!renameFolder) {
      throw new InternalServerError("failed to rename folder");
    }

    return {
      data: renameFolder,
    };
  }

  async checkFolderName(name: string): Promise<void> {
    const checkName = await this.folderRepository.fetchFoldersByName(name);

    if (checkName) {
      throw new BadRequestError("folder name taken");
    }
  }
}
