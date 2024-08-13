import { injectable } from "tsyringe";
import { AWSCognito, Stripe } from "../../../shared/facade";
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
  AWSCognitoSignInInput,
  AWSCognitoSignInOutput,
  AWSCognitoSignOutInput,
  AWSCognitoSignOutOutput,
  AWSCognitoSignupInput,
  AWSCognitoSignupOutput,
} from "../../../shared/dto";
import { UserRepository } from "../../../shared/repositories";
import { BadRequestError, InternalServerError } from "../../../shared/errors";
import { UserAccountStatus } from "../../../shared/constants";

@injectable()
export default class CustomerAuthService {
  constructor(
    private awsCognito: AWSCognito,
    private userRepository: UserRepository,
    private stripe: Stripe,
  ) {}

  async signUp(args: AWSCognitoSignupInput): Promise<AWSCognitoSignupOutput> {
    const { email, firstname, lastname } = args;
    const response = await this.awsCognito.signUp(args);

    if (!response) {
      throw new BadRequestError("failed to signup ");
    }

    const { customer_id } = await this.stripe.createCustomer({
      email,
      name: `${firstname} ${lastname}`,
    });

    if (!customer_id) {
      throw new BadRequestError("failed to create customer account");
    }

    const user = await this.userRepository.create({
      awscognito_user_id: response.userId!,
      stripe_customer_id: customer_id,
      status: UserAccountStatus.UNCONFIRM,
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

    //TODO: add logic to confirm user here
    return response;
  }

  async resendConfirmSignup(args: AWSCognitoResendSignupCodeInput): Promise<AWSCognitoResendSignupCodeOutput> {
    return await this.awsCognito.resendSignupConfirmationCode(args);
  }
  async signIn(args: AWSCognitoSignInInput): Promise<AWSCognitoSignInOutput> {
    const response = await this.awsCognito.signIn(args);

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
