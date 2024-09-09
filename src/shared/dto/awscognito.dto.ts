import { AttributeType, AuthenticationResultType } from "@aws-sdk/client-cognito-identity-provider";

export type AWSCognitoSignupInput = {
  password: string;
  email: string;
  firstname: string;
  lastname: string;
};

export type AWSCognitoSignupOutput = {
  isSignedUp: boolean | undefined;
  userId: string | undefined;
};

export type AWSCognitoConfirmSignupInput = {
  email: string;
  userId: string;
  confirmationcode: string;
};

export type AWSCognitoConfirmSignupOutput = {
  isConfirm: boolean;
};

export type AWSCognitoResendSignupCodeInput = {
  email: string;
};

export type AWSCognitoResendSignupCodeOutput = {
  isCodeSent: boolean;
};

export type AWSCognitoSignInInput = {
  password: string;
  email: string;
};

export type AWSCognitoSignInOutput = {
  isAuthenticated: boolean;
  tokens: AuthenticationResultType;
};

export type AWSCognitoSignOutInput = {
  access_token: string;
};

export type AWSCognitoSignOutOutput = {
  isLogout: boolean | undefined;
};

export type AWSCognitoForgotPasswordInput = {
  email: string;
};

export type AWSCognitoForgotPasswordOutput = {
  isUsernameConfirmed: boolean | undefined;
};

export type AWSCognitoConfirmForgotPasswordInput = {
  email: string;
  password: string;
  confirmationcode: string;
};

export type AWSCognitoConfirmForgotPasswordOutput = {
  isPasswordChanged: boolean | undefined;
};

export type AWSCognitoChangepasswordInput = {
  previousPassword: string;
  proposedPassword: string;
  accessToken: string;
};

export type AWSCognitoChangepasswordOutput = {
  isChanged: boolean;
};

export type AWSCognitoGetProfileOutput = {
  firstName: string | AttributeType | undefined;
  lastName: string | AttributeType | undefined;
  email: string | AttributeType | undefined;
  payment_method?: string;
  card_type?: string;
  card_last_digits?: string;
  card_expire_date?: string;
};

export type AWSCognitoUpdateProfileInput = {
  firstName: string | undefined;
  lastName: string | undefined;
  accessToken: string;
};

export type AWSCognitoUpdateProfileOutput = {
  isUpdated: boolean;
};

export type AWSCognitoRefreshTokenInput = {
  refresh_token: string;
  email: string;
};

export type AWSCognitoRefreshTokenOutput = {
  access_token: string | undefined;
  id_token: string | undefined;
  refresh_token: string | undefined;
};
