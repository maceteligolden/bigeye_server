import { UserLanguagePreference } from "../../../shared/constants";
import { AWSCognitoUpdateProfileInput, AWSCognitoUpdateProfileOutput } from "../../../shared/dto";

export type DeleteAccountInput = {
  accessToken: string;
  awsId: string;
};

export type DeleteAccountOutput = {
  isDeleted: boolean;
};

export type ChangepasswordInput = {
  previousPassword: string;
  proposedPassword: string;
  accessToken: string;
  awsId: string;
};

export type ChangepasswordOutput = {
  isChanged: boolean;
};

export type UpdateProfileInput = {
  cognitoId: string;
} & AWSCognitoUpdateProfileInput;

export type UpdateProfileOutput = {} & AWSCognitoUpdateProfileOutput;

export type ChangeLanguagePreferenceInput = {
  language: UserLanguagePreference;
  awsId: string;
}

export type ChangeLanguagePreferenceOutput = {
  isChanged: boolean;
}
