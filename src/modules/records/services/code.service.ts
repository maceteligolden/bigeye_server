import { injectable } from "tsyringe";
import { AWSS3, Database } from "../../../shared/facade";
import { BadRequestError } from "../../../shared/errors";
import { FileManagerRepository, UserRepository } from "../../../shared/repositories";
import { FileManagerObjectTypes } from "../../../shared/constants";

@injectable()
export default class CodeService {
  codes = [
    {
      id: 0,
      title: "Civil Code",
    },
    {
      id: 1,
      title: "Family Code",
    },
    {
      id: 2,
      title: "Penal Code",
    },
  ];

  constructor(
    private awsS3: AWSS3,
    private fileManagerRepository: FileManagerRepository,
    private userRepository: UserRepository,
    private database: Database,
  ) {}

  async getAllCodes(): Promise<any> {
    return this.codes;
  }

  async fetchCode(code_id: number): Promise<any> {
    const code_detail = this.codes.filter((code) => code.id === code_id);

    if (!code_detail.length) {
      throw new BadRequestError("invalid code id provided");
    }
    return await this.awsS3.getFilteredObjects(code_detail[0].title);
  }

  async download(key: string, user_id: string, folder_id?: string): Promise<any> {
    const user_detail = await this.userRepository.fetchOneByCognitoId(user_id);

    return await this.fileManagerRepository.create({
      key,
      user: await this.database.convertStringToObjectId(user_detail?._id!),
      name: key,
      object_type: FileManagerObjectTypes.CODE,
      parent: folder_id ? await this.database.convertStringToObjectId(folder_id) : undefined,
    });
  }
}
