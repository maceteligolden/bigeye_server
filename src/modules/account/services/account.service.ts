import { injectable } from "tsyringe";
import { AWSCognito } from "../../../shared/facade";
import { AWSCognitoGetProfileOutput, ChangepasswordInput, ChangepasswordOutput } from "../../../shared/dto";
import { DeleteAccountInput, DeleteAccountOutput, UpdateProfileInput, UpdateProfileOutput } from "../dto";
import { FileManagerRepository, UserRepository } from "../../../shared/repositories";
import { LoggerService } from "../../../shared/services";
import { GetProfileOutput } from "../interfaces";

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
      accessToken,
    });

    await this.loggerService.log("successfully changed account password", {
      dateChanged: new Date(),
      awsId,
    });

    return response;
  }

  async getAccount(accessToken: string, customerId: string): Promise<GetProfileOutput> {
    const response = await this.awsCognito.getProfile(accessToken);

    const user = await this.userRepository.fetchOneByCognitoId(customerId);

    return {
      ...response,
      payment_method: user?.stripe_card_id ? user?.stripe_card_id : "",
      card_type: user?.stripe_card_type ? user?.stripe_card_type : "",
      card_last_digits: user?.stripe_card_last_digits ? user?.stripe_card_last_digits : "",
      card_expire_date: user?.stripe_card_expire_date ? user?.stripe_card_expire_date : "",
    };
  }

  async deleteAccount(args: DeleteAccountInput): Promise<DeleteAccountOutput> {
    const { accessToken, awsId } = args;

    const user = await this.userRepository.fetchOneByCognitoId(awsId);

    await this.awsCognito.deleteProfile(accessToken);

    await this.userRepository.deleteByCognitoId(awsId);

    await this.fileManager.deleteManyByUserId(user?._id!);

    await this.loggerService.log("successfully deleted account", {
      awsId,
    });

    return {
      isDeleted: true,
    };
  }

  async updateAccount(args: UpdateProfileInput): Promise<UpdateProfileOutput> {
    const deleteCognitoUser = await this.awsCognito.updateProfile(args);

    return {
      isUpdated: deleteCognitoUser.isUpdated,
    };
  }
}
