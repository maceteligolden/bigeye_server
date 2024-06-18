import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { Res } from "../../../shared/helper";
import { StatusCodes } from "../../../shared/constants";
import { PlanService } from "../services";

@injectable()
export default class PlanController {
  constructor(private planService: PlanService) {}

  async getPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const response = await this.planService.getPlans();

      Res({
        res,
        code: StatusCodes.OK,
        message: "successfully fetched all plans",
        data: response
      });
    } catch (e: any) {
      next(e);
    }
  }

  async getActivePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sub } = req.user;

      const response = await this.planService.getActivePlan(sub);

      Res({
        res,
        code: StatusCodes.OK, 
        message: "successfully fetch active plan",
        data: response
      });
    } catch (e: any) {
      next(e);
    }
  }
}
