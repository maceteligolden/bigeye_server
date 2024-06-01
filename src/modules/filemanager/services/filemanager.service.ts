import { injectable } from "tsyringe";
import { DeleteObjectInput, DeleteObjectOutput, GetAllObjectsInput, GetAllObjectsOutput } from "../dto";
import { FileManagerRepository, UserRepository } from "../../../shared/repositories";
import { BadRequestError, InternalServerError } from "../../../shared/errors";

@injectable()
export default class FileManagerService {
  constructor(
    private fileManagerRepository: FileManagerRepository,
    private userRepository: UserRepository,
  ) {}

  async getAllObjects(args: GetAllObjectsInput): Promise<GetAllObjectsOutput> {
    const { user_id, page, limit } = args;

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const totalObject = await this.fileManagerRepository.totalObjectByUser(user_id);

    if (!totalObject) {
      throw new InternalServerError("failed to get total object count for user");
    }

    const page_count = Math.ceil(totalObject / limitNumber).toString();

    const check_user_id = await this.userRepository.fetchOneById(user_id);

    if (!check_user_id) {
      throw new BadRequestError("user not found");
    }

    const response = await this.fileManagerRepository.fetchAllByUserId(user_id, skip, limitNumber);

    if (!response) {
      throw new InternalServerError("failed to fetch all user objects");
    }

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
}
