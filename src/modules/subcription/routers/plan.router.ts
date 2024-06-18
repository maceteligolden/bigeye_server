import { Request, Response, NextFunction, Router } from "express";
import { container } from "tsyringe";
import { authMiddleware } from "../../../shared/middlewares";
import { PlanController } from "../controllers";

const planRouter = Router();
const planController = container.resolve(PlanController);

planRouter.get("/", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  planController.getPlans(req, res, next),
);
// adminPlanRouter.delete("/:planid", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
//   adminPlanController.createPlan(req, res, next),
// );

export default planRouter;
