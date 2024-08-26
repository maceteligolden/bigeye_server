import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { Res } from "../../shared/helper";
import { StatusCodes } from "../../shared/constants";
import axios from "axios";
import { stringify } from 'flatted';

@injectable()
export default class AIController {
  constructor() {}

  async prompt(req: Request, res: Response, next: NextFunction): Promise<void> {
    const data = await axios.post("https://test.api.newtonslaw.net/ask-newton", {messages: req.body.messages});

    const responseData = stringify(data.data); 

    Res({
      res,
      message: "successfully sent prompt",
      code: StatusCodes.OK,
      data: responseData
    });
  }
}
