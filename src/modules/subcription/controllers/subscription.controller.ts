import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { Res } from "../../../shared/helper";
import { StatusCodes } from "../../../shared/constants";
import { SubscriptionService } from "../services";

@injectable()
export default class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  async createSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user_id, plan_id } = req.body;

      const response = await this.subscriptionService.createSubscription({
        user: user_id,
        plan: plan_id,
      });

      Res({
        res,
        code: StatusCodes.CREATED,
        message: "successfully created subscription",
        data: response,
      });
    } catch (err: any) {
      next(err);
    }
  }
}
