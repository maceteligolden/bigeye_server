import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { StatusCodes } from "../../../shared/constants";
import { CustomerAuthService } from "../services";
import { Res } from "../../../shared/helper";

@injectable()
export default class CustomerAuthController {
  constructor(private customerAuthService: CustomerAuthService) {}

  async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { password, email, firstname, lastname } = req.body;

      const response = await this.customerAuthService.signUp({
        email,
        firstname,
        lastname,
        password,
      });

      Res({
        res,
        code: StatusCodes.CREATED,
        message: "successfully created user account",
        data: response,
      });
    } catch (e: any) {
      next(e);
    }
  }

  async confirmSignUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, confirmationcode, user_id } = req.body;

      const response = await this.customerAuthService.confirmSignup({
        email,
        confirmationcode,
        userId: user_id
      });

      Res({
        res,
        code: StatusCodes.OK,
        message: "successfully confirmed account",
        data: response,
      });
    } catch (e: any) {
      next(e);
    }
  }

  async resendSignupConfirmationCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      const response = await this.customerAuthService.resendConfirmSignup({
        email,
      });

      Res({
        res,
        code: StatusCodes.OK,
        message: "successfully resent confirmation code",
        data: response,
      });
    } catch (e: any) {
      next(e);
    }
  }

  async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const response = await this.customerAuthService.signIn({
        email,
        password,
      });

      Res({
        res,
        code: StatusCodes.OK,
        message: "successfully signed in",
        data: response,
      });
    } catch (e: any) {
      next(e);
    }
  }

  async signOut(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { authorization } = req.headers;

      const response = await this.customerAuthService.signOut({
        access_token: authorization ? authorization : "",
      });

      Res({
        res,
        code: StatusCodes.OK,
        message: "successfully signed out",
        data: response,
      });
    } catch (e: any) {
      next(e);
    }
  }

  async forgotpassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      const response = await this.customerAuthService.forgotPassword({
        email,
      });

      Res({
        res,
        code: StatusCodes.OK,
        message: "successfully sent forgotpassword email",
        data: response,
      });
    } catch (e: any) {
      next(e);
    }
  }

  async confirmForgotpassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, confirmationcode } = req.body;

      const response = await this.customerAuthService.confirmForgotPassword({
        email,
        password,
        confirmationcode,
      });

      Res({
        res,
        code: StatusCodes.OK,
        message: "successfully reset password",
        data: response,
      });
    } catch (e: any) {
      next(e);
    }
  }
}
