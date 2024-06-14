import { injectable } from "tsyringe";
import { UploadFileInput, UploadFileOutput } from "../dto";
import { FileRepository, UserRepository } from "../../../shared/repositories";
import { FileManagerObjectTypes } from "../../../shared/constants";
import { BadRequestError } from "../../../shared/errors";
import { IAction } from "../interfaces";
import { Database } from "../../../shared/facade";

@injectable()
export default class FileService implements IAction {
  constructor(
    private fileRepository: FileRepository,
    private userRepository: UserRepository,
    private database: Database,
  ) {}

  async uploadFile(args: UploadFileInput): Promise<UploadFileOutput> {
    const { files, parent, user_id } = args;

    const user = await this.userRepository.fetchOneByCognitoId(user_id);

    (files as unknown as Array<{ [fieldname: string]: File[] } | File[] | undefined>).map(async (file: any) => {
      await this.fileRepository.create({
        name: file ? file.originalname : "",
        key: file ? file.key : "",
        object_type: FileManagerObjectTypes.FILE,
        size: file ? file.size : 0,
        parent: parent ? await this.database.convertStringToObjectId(parent) : undefined,
        user: await this.database.convertStringToObjectId(user?._id!),
      });
    });

    return {
      isUploaded: true,
    };
  }

  async move(object_id: string, to: string): Promise<void> {
    const checkId = await this.fileRepository.fetchOneById(object_id);

    if (!checkId) {
      throw new BadRequestError("file not found");
    }

    const checkDestination = await this.fileRepository.fetchOneById(to);

    if (!checkDestination) {
      throw new BadRequestError("destination not found");
    }

    const moveObject = await this.fileRepository.update(object_id, {
      parent: await this.database.convertStringToObjectId(to),
    });

    if (!moveObject) {
      throw new BadRequestError("failed to move file");
    }
  }
  async copy(object_id: string, to: string): Promise<void> {
    const checkId = await this.fileRepository.fetchOneById(object_id);

    if (!checkId) {
      throw new BadRequestError("file not found");
    }

    const checkDestination = await this.fileRepository.fetchOneById(to);

    if (!checkDestination) {
      throw new BadRequestError("destination not found");
    }

    const copyFolder = await this.fileRepository.create({
      name: checkId.name,
      object_type: checkId.object_type,
      user: checkId.user,
      parent: checkId.parent,
    });

    if (!copyFolder) {
      throw new BadRequestError("failed to copy folder");
    }
  }
}
