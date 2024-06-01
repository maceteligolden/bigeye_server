import { injectable } from "tsyringe";
import { UploadFileInput, UploadFileOutput } from "../dto";
import { FileRepository } from "../../../shared/repositories";
import { FileManagerObjectTypes } from "../../../shared/constants";
import { BadRequestError, InternalServerError } from "../../../shared/errors";
import { IAction } from "../interfaces";
import { Database } from "../../../shared/facade";

@injectable()
export default class FileService implements IAction {
  constructor(
    private fileRepository: FileRepository,
    private database: Database,
  ) {}

  async uploadFile(args: UploadFileInput): Promise<UploadFileOutput> {
    const { files, parent, user_id } = args;

    (files as unknown as Array<{ [fieldname: string]: File[] } | File[] | undefined>).map(async (file: any) => {
      const uploadFile = await this.fileRepository.create({
        name: file ? file.key : "",
        object_type: FileManagerObjectTypes.FILE,
        parent: await this.database.convertStringToObjectId(parent),
        user: await this.database.convertStringToObjectId(user_id),
      });

      if (!uploadFile) {
        throw new InternalServerError("failed to upload file(s)");
      }
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
