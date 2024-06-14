import { injectable } from "tsyringe";
import { AWSCognito } from "../../../shared/facade";
import { AWSCognitoChangepasswordInput, AWSCognitoChangepasswordOutput } from "../../../shared/dto";
import { DeleteAccountInput, DeleteAccountOutput } from "../dto";
import { FileManagerRepository, UserRepository } from "../../../shared/repositories";

@injectable()
export default class AccountService {
  constructor(
    private awsCognito: AWSCognito,
    private userRepository: UserRepository,
    private fileManager: FileManagerRepository
) {}

  async changePassword(args: AWSCognitoChangepasswordInput): Promise<AWSCognitoChangepasswordOutput> {
    return await this.awsCognito.changePassword(args);
  }

  async deleteAccount(args: DeleteAccountInput): Promise<DeleteAccountOutput> {

    const { accessToken, awsId } = args;

    const user = await this.userRepository.fetchOneByCognitoId(awsId);

    await this.awsCognito.deleteProfile(accessToken);

    await this.userRepository.deleteByCognitoId(awsId)

    await this.fileManager.deleteManyByUserId(user?._id!)

    return {
        isDeleted: true
    }
  }
}
