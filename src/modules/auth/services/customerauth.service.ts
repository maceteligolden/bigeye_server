import { injectable } from "tsyringe";
import { AWSCognito } from "../../../shared/facade";
import {
  AWSCognitoConfirmForgotPasswordInput,
  AWSCognitoConfirmForgotPasswordOutput,
  AWSCognitoConfirmSignupInput,
  AWSCognitoConfirmSignupOutput,
  AWSCognitoForgotPasswordInput,
  AWSCognitoForgotPasswordOutput,
  AWSCognitoRefreshTokenInput,
  AWSCognitoRefreshTokenOutput,
  AWSCognitoResendSignupCodeInput,
  AWSCognitoResendSignupCodeOutput,
  AWSCognitoSignOutInput,
  AWSCognitoSignOutOutput,
  AWSCognitoSignupInput,
  AWSCognitoSignupOutput,
} from "../../../shared/dto";
import { UserRepository } from "../../../shared/repositories";
import { BadRequestError } from "../../../shared/errors";
import { UserAccountStatus } from "../../../shared/constants";
import { CustomerSignInInput, CustomerSignInOutput } from "../dto";

@injectable()
export default class CustomerAuthService {
  constructor(
    private awsCognito: AWSCognito,
    private userRepository: UserRepository
  ) {}

  async signUp(args: AWSCognitoSignupInput): Promise<AWSCognitoSignupOutput> {
    const { email, firstname, lastname } = args;

    // save to aws cognito user pool
    const response = await this.awsCognito.signUp(args);

    if (!response) {
      throw new BadRequestError("failed to signup ");
    }

    // save user data to DB
    const user = await this.userRepository.create({
      awscognito_user_id: response.userId!,
      status: UserAccountStatus.UNCONFIRM,
      email,
      first_name: firstname,
      last_name: lastname,
    });

    if (!user) {
      throw new BadRequestError("failed to add user record");
    }

    return response;
  }

  async confirmSignup(args: AWSCognitoConfirmSignupInput): Promise<AWSCognitoConfirmSignupOutput> {
    const response = await this.awsCognito.confirmSignUp(args);

    // change user account status from UNCONFIRMED to ACTIVE
    await this.userRepository.updateAccountStatus(args.userId, UserAccountStatus.ACTIVE);

    //TODO: add logic to confirm user on database
    return response;
  }

  async resendConfirmSignup(args: AWSCognitoResendSignupCodeInput): Promise<AWSCognitoResendSignupCodeOutput> {
    return await this.awsCognito.resendSignupConfirmationCode(args);
  }
  async signIn(args: CustomerSignInInput): Promise<CustomerSignInOutput> {
    const { email, password } = args;

    const user = await this.userRepository.fetchAllByEmail(email);

    if (!user) {
      throw new BadRequestError("invalid details provided");
    }

    const response = await this.awsCognito.signIn({
      email,
      password,
    });

    return response;
  }

  async signOut(args: AWSCognitoSignOutInput): Promise<AWSCognitoSignOutOutput> {
    return await this.awsCognito.signOut(args);
  }

  async forgotPassword(args: AWSCognitoForgotPasswordInput): Promise<AWSCognitoForgotPasswordOutput> {
    return await this.awsCognito.forgotpassword(args);
  }

  async confirmForgotPassword(
    args: AWSCognitoConfirmForgotPasswordInput,
  ): Promise<AWSCognitoConfirmForgotPasswordOutput> {
    return await this.awsCognito.confirmForgotPassword(args);
  }

  async refreshToken(args: AWSCognitoRefreshTokenInput): Promise<AWSCognitoRefreshTokenOutput> {
    return await this.awsCognito.refreshAccessToken(args);
  }
}
