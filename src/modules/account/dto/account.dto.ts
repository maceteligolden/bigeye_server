export type DeleteAccountInput = {
  accessToken: string;
  awsId: string;
};

export type DeleteAccountOutput = {
  isDeleted: boolean;
};
