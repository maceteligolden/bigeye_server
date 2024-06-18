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

//   async deletePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const { planid } = req.params;

//       await this.adminPlanService.deletePlan({
//         plan_id: planid,
//       });

//       Res({
//         res,
//         code: StatusCodes.CREATED,
//         message: "successfully deleted a subscription plan",
//       });
//     } catch (e: any) {
//       next(e);
//     }
//   }
}
