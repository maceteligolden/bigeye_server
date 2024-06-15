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
