import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { Res } from "../../shared/helper";
import { StatusCodes } from "../../shared/constants";

import AIService from "./ai.service";

@injectable()
export default class AIController {
  constructor(private aiSservice: AIService) {}

  async prompt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { message, chat_id, from } = req.body;

      const { sub } = req.user;

      const data = await this.aiSservice.sendPrompt({ message, chat_id, from: sub });

      Res({
        res,
        message: "successfully sent prompt",
        code: StatusCodes.OK,
        data,
      });
    } catch (err: any) {
      next(err);
    }
  }
}
