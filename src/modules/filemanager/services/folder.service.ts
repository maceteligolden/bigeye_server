import { injectable } from "tsyringe";
import {
  CreateFolderInput,
  CreateFolderOutput,
  DeleteFolderInput,
  RenameFolderInput,
  RenameFolderOutput,
} from "../dto";
import { FileRepository, FolderRepository, UserRepository } from "../../../shared/repositories";
import { BadRequestError, InternalServerError, NotFoundError, NotModifiedError } from "../../../shared/errors";
import { FileManagerObjectTypes } from "../../../shared/constants";
import { IAction } from "../interfaces";
import { FileManager } from "../../../shared/entities";
import { Database } from "../../../shared/facade";

@injectable()
export default class FolderService implements IAction {
  constructor(
    private folderRepository: FolderRepository,
    private fileRepository: FileRepository,
    private userRepository: UserRepository,
    private database: Database,
  ) {}

  async move(object_id: string[], to: string): Promise<void> {
    const checkDestination = await this.folderRepository.fetchOneById(to);

    if (!checkDestination) {
      throw new BadRequestError("destionation not found");
    }

    object_id.map(async (id, _) => {
      const moveObject = await this.folderRepository.update(id, {
        parent: await this.database.convertStringToObjectId(to),
      });

      if (!moveObject) {
        throw new BadRequestError("failed to move folder");
      }
    });
  }
  async copy(object_id: string, to: string): Promise<void> {
    
    const checkId = await this.folderRepository.fetchOneById(object_id);

    if (!checkId) {
      throw new BadRequestError("folder not found");
    }

    const checkDestination = await this.folderRepository.fetchOneById(to);

    if (!checkDestination) {
      throw new BadRequestError("destination not found");
    }

    const copyFolder = await this.folderRepository.create({
      name: await this.database.convertStringToObjectId(to) === checkId.parent ? `${checkId.name}copy` : checkId.name,
      object_type: checkId.object_type,
      user: checkId.user,
      parent: checkId.parent,
    });

    if (!copyFolder) {
      throw new BadRequestError("failed to copy folder");
    }

    const files = await this.fileRepository.fetchAllByParent(object_id);

   

    files.map(async (file: any) => {
      
      await this.fileRepository.create({
        name: file.name,
        key: file.key,
        object_type: FileManagerObjectTypes.FILE,
        size: file.size,
        parent: await this.database.convertStringToObjectId(copyFolder._id!),
        user: file.user,
      });
    });

    const folders = await this.folderRepository.fetchAllByParent(object_id);

    folders.map((folder: any) => {
      this.copy(folder._id!, copyFolder._id!);
    });
  }

  async createFolder(args: CreateFolderInput): Promise<CreateFolderOutput> {
    const { name, parent_folder_id, user_id } = args;

    const user = await this.userRepository.fetchOneByCognitoId(user_id);

    if (!user) {
      throw new BadRequestError("account not found");
    }

    await this.checkFolderName(name, user._id!);

    const addFolder = await this.folderRepository.create({
      name: name,
      user: await this.database.convertStringToObjectId(user._id!),
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
      throw new NotFoundError("failed to delete folder");
    }
  }

  async renameFolder(args: RenameFolderInput): Promise<RenameFolderOutput> {
    const { name, folder_id, user_id } = args;

    const user = await this.userRepository.fetchOneByCognitoId(user_id);

    if (!user) {
      throw new BadRequestError("account not found");
    }

    await this.checkFolderName(name, user._id!);

    const renameFolder = await this.folderRepository.update(folder_id, {
      name,
    });

    if (!renameFolder) {
      throw new NotModifiedError("failed to rename folder");
    }

    return {
      data: renameFolder,
    };
  }

  async checkFolderName(name: string, user_id: string): Promise<void> {
    const checkName = await this.folderRepository.fetchFoldersByName(name, user_id);

    if (checkName) {
      throw new BadRequestError("folder name taken");
    }
  }
}
