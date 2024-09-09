export interface IAWS {
  initialize(): void;
}

export interface IAWSCognito {
  signIn(): Promise<any>;
}
