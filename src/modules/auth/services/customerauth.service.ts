import { injectable } from "tsyringe";
import { AWSCognito, Stripe } from "../../../shared/facade";
import {
  AWSCognitoConfirmForgotPasswordInput,
  AWSCognitoConfirmForgotPasswordOutput,
  AWSCognitoConfirmSignupInput,
  AWSCognitoConfirmSignupOutput,
  AWSCognitoForgotPasswordInput,
  AWSCognitoForgotPasswordOutput,
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
import { BadRequestError } from "../../../shared/errors";

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
    });

    if (!user) {
      throw new BadRequestError("failed to add user record");
    }

    return response;
  }

  async confirmSignup(args: AWSCognitoConfirmSignupInput): Promise<AWSCognitoConfirmSignupOutput> {
    const response = await this.awsCognito.confirmSignUp(args);

    return response;
  }

  async resendConfirmSignup(args: AWSCognitoResendSignupCodeInput): Promise<AWSCognitoResendSignupCodeOutput> {
    return await this.awsCognito.resendSignupConfirmationCode(args);
  }
  async signIn(args: AWSCognitoSignInInput): Promise<AWSCognitoSignInOutput> {
    return await this.awsCognito.signIn(args);
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
}
