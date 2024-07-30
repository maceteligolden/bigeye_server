import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { StatusCodes } from "../../../shared/constants";
import { Res } from "../../../shared/helper";
import { CardService } from "../services";

@injectable()
export default class CardController {
  constructor(private cardService: CardService) {}

  async authorizeAddCard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sub } = req.user;

      const response = await this.cardService.authorizeAddCard({ user_id: sub });

      Res({
        res,
        code: StatusCodes.OK,
        message: "successfully authorized add card",
        data: response,
      });
    } catch (e: any) {
      next(e);
    }
  }

  async deleteCard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sub } = req.user;

      const response = await this.cardService.deleteCard(sub);

      Res({
        res,
        code: StatusCodes.NO_CONTENT,
        message: "successfully deleted card",
      });
    } catch (e: any) {
      next(e);
    }
  }
}
