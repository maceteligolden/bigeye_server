import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { Res } from "../../../shared/helper";
import { StatusCodes } from "../../../shared/constants";
import { AccountService } from "../services";

@injectable()
export default class AccountController {
  constructor(private accountService: AccountService) {}

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const accessToken = req.headers.authorization?.split(" ")[1];
      const { previousPassword, proposedPassword } = req.body;

      await this.accountService.changePassword({
        previousPassword,
        proposedPassword,
        accessToken: accessToken ? accessToken : "",
      });

      Res({
        res,
        message: "successfully changepassword",
        code: StatusCodes.NO_CONTENT,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const accessToken = req.headers.authorization?.split(" ")[1];
      const { sub } = req.user;

      await this.accountService.deleteAccount({
        awsId: sub,
        accessToken: accessToken ? accessToken : "",
      });

      Res({
        res,
        message: "successfully deleted account",
        code: StatusCodes.NO_CONTENT,
      });
    } catch (err: any) {
      next(err);
    }
  }
}
