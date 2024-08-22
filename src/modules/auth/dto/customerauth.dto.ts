import { AuthenticationResultType } from "@aws-sdk/client-cognito-identity-provider";

export type CustomerSignInInput = {
  password: string;
  email: string;
  device_token: string;
};

export type CustomerSignInOutput = {
  isAuthenticated: boolean;
  tokens: AuthenticationResultType;
};
