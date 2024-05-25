import { Request, Response, NextFunction, Router } from "express";
import { container } from "tsyringe";
import { AdminPlanController } from "../controllers";

const adminPlanRouter = Router();
const adminPlanController = container.resolve(AdminPlanController);

adminPlanRouter.post("/create-plan", (req: Request, res: Response, next: NextFunction) =>
  adminPlanController.createPlan(req, res, next),
);
adminPlanRouter.delete("/:planid", (req: Request, res: Response, next: NextFunction) =>
  adminPlanController.createPlan(req, res, next),
);

export default adminPlanRouter;
