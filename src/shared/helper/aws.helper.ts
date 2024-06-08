import { injectable } from "tsyringe";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import crypto from "crypto";
import { CognitoJwtVerifier } from "aws-jwt-verify";

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
        console.log("signed key: " + signingKey);
        callback(null, signingKey);
      }
    });
  }

  async verifySecret(token: string): Promise<any> {
    const verifier = CognitoJwtVerifier.create({
      userPoolId: `${process.env.AWS_COGNITO_USER_POOL_ID}`,
      tokenUse: "access",
      clientId: `${process.env.AWS_COGNITO_CLIENT_ID}`,
    });
    return await verifier.verify(token);
  }
}
