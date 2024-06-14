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
    const { user_id, page, limit, folder } = args;

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const check_user_id = await this.userRepository.fetchOneByCognitoId(user_id);

    const totalObject = await this.fileManagerRepository.totalObjectByUser(check_user_id?._id!, folder);

    const page_count = Math.ceil(totalObject / limitNumber).toString();

    const response = await this.fileManagerRepository.fetchAllByUserId(check_user_id?._id!, skip, limitNumber, folder);

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
