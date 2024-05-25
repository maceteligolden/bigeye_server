import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { Res } from "../../../shared/helper";
import { StatusCodes } from "../../../shared/constants";
import { AdminPlanService } from "../services";

@injectable()
export default class AdminPlanController {
  constructor(private adminPlanService: AdminPlanService) {}

  async createPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, amount } = req.body;

      await this.adminPlanService.createPlan({
        name,
        amount,
      });

      Res({
        res,
        code: StatusCodes.CREATED,
        message: "successfully created a subscription plan",
      });
    } catch (e: any) {
      next(e);
    }
  }

  async deletePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { planid } = req.params;

      await this.adminPlanService.deletePlan({
        plan_id: planid,
      });

      Res({
        res,
        code: StatusCodes.CREATED,
        message: "successfully deleted a subscription plan",
      });
    } catch (e: any) {
      next(e);
    }
  }
}
