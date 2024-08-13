import { injectable } from "tsyringe";
import {
  AuthFlowType,
  ChangePasswordCommand,
  CodeDeliveryFailureException,
  CodeMismatchException,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  DeleteUserCommand,
  ExpiredCodeException,
  ForgotPasswordCommand,
  GetUserCommand,
  GlobalSignOutCommand,
  InitiateAuthCommand,
  InvalidPasswordException,
  NotAuthorizedException,
  ResendConfirmationCodeCommand,
  SignUpCommand,
  UpdateUserAttributesCommand,
  UserNotConfirmedException,
  UserNotFoundException,
  UsernameExistsException,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  AWSCognitoChangepasswordInput,
  AWSCognitoChangepasswordOutput,
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
  AWSCognitoUpdateProfileInput,
  AWSCognitoUpdateProfileOutput,
} from "../dto";
import { StatusCodes } from "../constants";
import { AWS } from "../helper";
import { BadRequestError, InternalServerError } from "../errors";

@injectable()
export default class AWSCognito {
  private client: CognitoIdentityProviderClient;

  constructor(private aws: AWS) {
    this.client = new CognitoIdentityProviderClient({
      region: `${process.env.AWS_SQS_REGION}`,
      credentials: {
        accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
        secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
      },
    });
  }

  async signUp(args: AWSCognitoSignupInput): Promise<AWSCognitoSignupOutput> {
    try {
      const { password, email, firstname, lastname } = args;

      const params = {
        ClientId: `${process.env.AWS_COGNITO_CLIENT_ID}`,
        SecretHash: await this.aws.generateSecretHash(email),
        Username: email,
        Password: password,
        UserAttributes: [
          {
            Name: "given_name",
            Value: firstname,
          },
          {
            Name: "family_name",
            Value: lastname,
          },
        ],
      };

      const command = new SignUpCommand(params);
      const response = await this.client.send(command);

      return {
        isSignedUp: response.UserConfirmed,
        userId: response.UserSub,
      };
    } catch (e: any) {
      if (e instanceof InvalidPasswordException) {
        throw new BadRequestError("invalid password");
      } else if (e instanceof UsernameExistsException) {
        throw new BadRequestError("email already exists");
      } else {
        throw new InternalServerError(e);
      }
    }
  }

  async confirmSignUp(args: AWSCognitoConfirmSignupInput): Promise<AWSCognitoConfirmSignupOutput> {
    try {
      const { email, confirmationcode } = args;

      const params = {
        ClientId: `${process.env.AWS_COGNITO_CLIENT_ID}`,
        SecretHash: await this.aws.generateSecretHash(email),
        Username: `${email}`,
        ConfirmationCode: `${confirmationcode}`,
      };

      const command = new ConfirmSignUpCommand(params);
      const response = await this.client.send(command);

      return {
        isConfirm: response.$metadata.httpStatusCode === StatusCodes.OK ? true : false,
      };
    } catch (e: any) {
      if (e instanceof ExpiredCodeException) {
        throw new BadRequestError("code has expired");
      } else if (e instanceof UserNotFoundException) {
        throw new BadRequestError("user not found");
      } else {
        throw new InternalServerError("unexpected error in auth service confirm signup");
      }
    }
  }

  async resendSignupConfirmationCode(args: AWSCognitoResendSignupCodeInput): Promise<AWSCognitoResendSignupCodeOutput> {
    try {
      const { email } = args;

      const params = {
        ClientId: `${process.env.AWS_COGNITO_CLIENT_ID}`,
        SecretHash: await this.aws.generateSecretHash(email),
        Username: `${email}`,
      };

      const command = new ResendConfirmationCodeCommand(params);
      const response = await this.client.send(command);

      return {
        isCodeSent: response.$metadata.httpStatusCode === StatusCodes.OK ? true : false,
      };
    } catch (e: any) {
      if (e instanceof CodeDeliveryFailureException) {
        throw new BadRequestError("code failed to resend");
      } else {
        throw new InternalServerError("unexpected error occurred when trying to resend confirmation code");
      }
    }
  }

  async signIn(args: AWSCognitoSignInInput): Promise<AWSCognitoSignInOutput> {
    try {
      const { email, password } = args;

      const params = {
        ClientId: `${process.env.AWS_COGNITO_CLIENT_ID}`,
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters: {
          PASSWORD: `${password}`,
          SECRET_HASH: await this.aws.generateSecretHash(email),
          USERNAME: `${email}`,
        },
      };

      const command = new InitiateAuthCommand(params);
      const response = await this.client.send(command);

      return {
        isAuthenticated: response.$metadata.httpStatusCode === StatusCodes.OK ? true : false,
        tokens: {
          AccessToken: response.AuthenticationResult?.AccessToken,
          RefreshToken: response.AuthenticationResult?.RefreshToken,
        },
      };
    } catch (e: any) {
      if (e instanceof UserNotFoundException) {
        throw new BadRequestError("user not found");
      } else if (e instanceof NotAuthorizedException) {
        throw new BadRequestError("invalid details provided");
      } else if (e instanceof UserNotConfirmedException) {
        throw new BadRequestError("user not confirmed");
      } else {
        throw new InternalServerError(e);
      }
    }
  }

  async refreshAccessToken(args: AWSCognitoRefreshTokenInput): Promise<AWSCognitoRefreshTokenOutput> {
    try {
      const { refresh_token, email } = args;
      
      const params = {
        AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
        ClientId: `${process.env.AWS_COGNITO_CLIENT_ID}`,
        AuthParameters: {
          REFRESH_TOKEN: refresh_token,
          SECRET_HASH: await this.aws.generateSecretHash(email),
        },
      };

      const command = new InitiateAuthCommand(params);
      const response = await this.client.send(command);

      return {
        access_token: response.AuthenticationResult?.AccessToken,
        id_token: response.AuthenticationResult?.IdToken,
        refresh_token: response.AuthenticationResult?.RefreshToken,
      };
    } catch (e: any) {
      throw new InternalServerError(e);
    }
  }

  async signOut(args: AWSCognitoSignOutInput): Promise<AWSCognitoSignOutOutput> {
    try {
      const { access_token } = args;

      const params = {
        AccessToken: `${access_token.split(" ")[1]}`,
      };

      const command = new GlobalSignOutCommand(params);
      const response = await this.client.send(command);
      return {
        isLogout: response.$metadata.httpStatusCode === StatusCodes.OK ? true : false,
      };
    } catch (e: any) {
      throw new InternalServerError(e);
    }
  }

  async forgotpassword(args: AWSCognitoForgotPasswordInput): Promise<AWSCognitoForgotPasswordOutput> {
    try {
      const { email } = args;

      const params = {
        ClientId: `${process.env.AWS_COGNITO_CLIENT_ID}`,
        SecretHash: await this.aws.generateSecretHash(email),
        Username: email,
      };

      const command = new ForgotPasswordCommand(params);
      const response = await this.client.send(command);

      return {
        isUsernameConfirmed: response.$metadata.httpStatusCode === StatusCodes.OK ? true : false,
      };
    } catch (e: any) {
      if (e instanceof CodeDeliveryFailureException) {
        throw new BadRequestError("code failed to send");
      } else if (e instanceof UserNotFoundException) {
        throw new BadRequestError("user not found");
      } else {
        throw new InternalServerError(e);
      }
    }
  }

  async confirmForgotPassword(
    args: AWSCognitoConfirmForgotPasswordInput,
  ): Promise<AWSCognitoConfirmForgotPasswordOutput> {
    try {
      const { email, password, confirmationcode } = args;

      const params = {
        ClientId: `${process.env.AWS_COGNITO_CLIENT_ID}`,
        SecretHash: await this.aws.generateSecretHash(email),
        Username: email,
        Password: password,
        ConfirmationCode: confirmationcode,
      };

      const command = new ConfirmForgotPasswordCommand(params);

      const response = await this.client.send(command);

      return {
        isPasswordChanged: response.$metadata.httpStatusCode === StatusCodes.OK ? true : false,
      };
    } catch (e: any) {
      if (e instanceof CodeMismatchException) {
        throw new BadRequestError("code doesnt match");
      } else if (e instanceof ExpiredCodeException) {
        throw new BadRequestError("code expired");
      } else if (e instanceof InvalidPasswordException) {
        throw new BadRequestError("invalid password");
      } else if (e instanceof UserNotFoundException) {
        throw new BadRequestError("user not found");
      } else if (e instanceof UserNotConfirmedException) {
        throw new BadRequestError("user not confirmed");
      } else {
        throw new InternalServerError("unexpected error occurred in auth service confirmforgotpassword");
      }
    }
  }

  async changePassword(args: AWSCognitoChangepasswordInput): Promise<AWSCognitoChangepasswordOutput> {
    try {
      const { previousPassword, proposedPassword, accessToken } = args;

      const params = {
        PreviousPassword: previousPassword,
        ProposedPassword: proposedPassword,
        AccessToken: accessToken,
      };

      const command = new ChangePasswordCommand(params);

      const response = await this.client.send(command);

      return {
        isChanged: response.$metadata.httpStatusCode === StatusCodes.CREATED ? true : false,
      };
    } catch (err: any) {
      throw new InternalServerError(err);
    }
  }

  async deleteProfile(accessToken: string): Promise<void> {
    const input = {
      AccessToken: accessToken,
    };
    const command = new DeleteUserCommand(input);
    await this.client.send(command);
  }

  async getProfile(accessToken: string) {
    const input = {
      AccessToken: accessToken,
    };
    const command = new GetUserCommand(input);
    const response = await this.client.send(command);
    return {
      firstName: response.UserAttributes && response.UserAttributes[3].Value,
      lastName: response.UserAttributes && response.UserAttributes[2].Value,
      email: response.UserAttributes && response.UserAttributes[0].Value,
    };
  }

  async updateProfile(args: AWSCognitoUpdateProfileInput): Promise<AWSCognitoUpdateProfileOutput> {
    const { firstName, lastName, accessToken } = args;

    const input = {
      // UpdateUserAttributesRequest
      UserAttributes: [
        // AttributeListType // required
        {
          // AttributeType
          Name: "given_name", // required
          Value: firstName,
        },
        {
          // AttributeType
          Name: "family_name", // required
          Value: lastName,
        },
      ],
      AccessToken: accessToken, // required
    };
    const command = new UpdateUserAttributesCommand(input);
    await this.client.send(command);

    return {
      isUpdated: true,
    };
  }
}
