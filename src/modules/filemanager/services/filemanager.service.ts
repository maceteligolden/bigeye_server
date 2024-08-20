import { injectable } from "tsyringe";
import {
  DeleteManyObjectInput,
  DeleteManyObjectOutput,
  DeleteObjectInput,
  DeleteObjectOutput,
  GetAllObjectsInput,
  GetAllObjectsOutput,
} from "../dto";
import { FileManagerRepository, UserRepository } from "../../../shared/repositories";
import { BadRequestError, InternalServerError } from "../../../shared/errors";
import { Database } from "../../../shared/facade";

@injectable()
export default class FileManagerService {
  constructor(
    private fileManagerRepository: FileManagerRepository,
    private userRepository: UserRepository,
    private database: Database,
  ) {}

  async getAllObjects(args: GetAllObjectsInput): Promise<GetAllObjectsOutput> {
    const { user_id, page, limit, folder } = args;

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const check_user_id = await this.userRepository.fetchOneByCognitoId(user_id);

    const totalObject = await this.fileManagerRepository.totalObjectByUser(check_user_id?._id!, folder);

    const page_count = Math.ceil(totalObject / limitNumber).toString();

    const response = await this.fileManagerRepository.fetchHomeByUserId(check_user_id?._id!, skip, limitNumber, folder);

    return {
      data: response,
      page_count,
      current_page_number: page.toString(),
    };
  }

  async deleteObject(args: DeleteObjectInput): Promise<DeleteObjectOutput> {
    const { object_id } = args;

    const checkObject = await this.fileManagerRepository.fetchOneById(object_id);

    if (!checkObject) {
      throw new BadRequestError("object not found");
    }

    const deleteObject = await this.fileManagerRepository.delete(object_id);

    if (!deleteObject) {
      throw new InternalServerError("failed to delete object");
    }

    return {
      isObjectDeleted: true,
    };
  }

  async deleteManyObjects(args: DeleteManyObjectInput): Promise<DeleteManyObjectOutput> {
    const { object_ids } = args;

    await this.fileManagerRepository.deleteMany(object_ids);

    return {
      isDeleted: true,
    };
  }

  async moveObjects(object_id: string[], to: string): Promise<void> {
    const checkDestination = await this.fileManagerRepository.fetchOneById(to);

    if (!checkDestination) {
      throw new BadRequestError("destination not found");
    }

    object_id.map(async (id, _) => {
      const moveObject = await this.fileManagerRepository.update(id, {
        parent: await this.database.convertStringToObjectId(to),
      });

      if (!moveObject) {
        throw new BadRequestError("failed to move file");
      }
    });
  }

  async copyObjects(object_ids: string[], to: string): Promise<void> {
    const checkDestination = await this.fileManagerRepository.fetchOneById(to);

    if (!checkDestination) {
      throw new BadRequestError("destination not found");
    }

    const copyFolder = await this.fileManagerRepository.create({
      name: (await this.database.convertStringToObjectId(to)) === checkDestination.parent ? `${checkDestination.name}copy` : checkDestination.name,
      object_type: checkDestination.object_type,
      user: checkDestination.user,
      parent: await this.database.convertStringToObjectId(to)
    });

    if (!copyFolder) {
      throw new BadRequestError("failed to copy folder");
    }
    
    object_ids.map(async (object_id)=> {
      const folders = await this.fileManagerRepository.fetchAllByParent(object_id);

      folders.map((folder: any) => {
        this.copyObjects(folder._id!, copyFolder._id!);
      });
    });

  }
}
