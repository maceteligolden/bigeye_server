import { injectable } from "tsyringe";
import jwt from "jsonwebtoken";

@injectable()
export default class AWS {
  constructor() {}

  generateSecretHash(email: string): string {
    return jwt.sign(email, `${process.env.AWS_COGNITO_SECRETHASH}`);
  }

  verifySecret(token: string): any {
    const verify = jwt.verify(token, `${process.env.AWS_COGNITO_SECRETHASH}`);

    return verify;
  }
}
