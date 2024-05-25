import { injectable } from "tsyringe";
import crypto from "crypto";

@injectable()
export default class AWS {
  constructor() {}

  generateSecretHash(email: string) {
    return crypto
      .createHmac("sha256", `${process.env.AWS_COGNITO_SECRETHASH}`)
      .update(`${email}${process.env.AWS_COGNITO_CLIENT_ID}`)
      .digest("base64");
  }
}
