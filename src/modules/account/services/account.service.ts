import { injectable } from "tsyringe";
import { AWSCognito } from "../../../shared/facade";
import {
  AWSCognitoGetProfileOutput,
  ChangepasswordInput,
  ChangepasswordOutput,
} from "../../../shared/dto";
import { DeleteAccountInput, DeleteAccountOutput } from "../dto";
import { FileManagerRepository, UserRepository } from "../../../shared/repositories";
import { LoggerService } from "../../../shared/services";

@injectable()
export default class AccountService {
  constructor(
    private awsCognito: AWSCognito,
    private userRepository: UserRepository,
    private fileManager: FileManagerRepository,
    private loggerService: LoggerService,
  ) {}

  async changePassword(args: ChangepasswordInput): Promise<ChangepasswordOutput> {
    const { awsId, previousPassword, proposedPassword, accessToken } = args;
    const response = await this.awsCognito.changePassword({
      previousPassword,
      proposedPassword,
      accessToken
    });

    await this.loggerService.log("successfully changed account password", {
      dateChanged: new Date(),
      awsId
    });

    return response;
  }

  async getAccount(accessToken: string): Promise<AWSCognitoGetProfileOutput> {
    const response = await this.awsCognito.getProfile(accessToken);

    return { ...response };
  }

  async deleteAccount(args: DeleteAccountInput): Promise<DeleteAccountOutput> {
    const { accessToken, awsId } = args;

    const user = await this.userRepository.fetchOneByCognitoId(awsId);

    await this.awsCognito.deleteProfile(accessToken);

    await this.userRepository.deleteByCognitoId(awsId);

    await this.fileManager.deleteManyByUserId(user?._id!);

    await this.loggerService.log("successfully deleted account", {
      awsId
    })

    return {
      isDeleted: true,
    };
  }
}
