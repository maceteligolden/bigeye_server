import { injectable } from "tsyringe";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import crypto from "crypto";

@injectable()
export default class AWS {
  constructor() {}

  generateSecretHash(email: string): string {
    return crypto
      .createHmac("SHA256", `${process.env.AWS_COGNITO_SECRETHASH}`)
      .update(`${email}${process.env.AWS_COGNITO_CLIENT_ID}`)
      .digest("base64");
  }

  async getKey(header: any, callback: any) {
    const client = jwksClient({
      jwksUri: `https://cognito-idp.${process.env.AWS_COGNITO_REGION}.amazonaws.com/${process.env.AWS_COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
    });

    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        callback(err);
      } else {
        const signingKey = key?.getPublicKey;
        callback(null, signingKey);
      }
    });
  }

  verifySecret(token: string): any {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        this.getKey,
        {
          algorithms: ["RS256"],
          issuer: `https://cognito-idp.${process.env.AWS_COGNITO_REGION}.amazonaws.com/${process.env.AWS_COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
        },
        (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        },
      );
    });
  }
}
