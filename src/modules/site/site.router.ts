import { container } from "tsyringe";
import { Request, Response, NextFunction, Router } from "express";
import { authMiddleware } from "../../shared/middlewares";
import SiteController from "./site.controller";

const siteRouter = Router();
const siteController = container.resolve(SiteController);

siteRouter.post("/", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  siteController.create(req, res, next),
);

siteRouter.get("/", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  siteController.fetchAll(req, res, next),
);

siteRouter.delete("/:site_id", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  siteController.delete(req, res, next),
);

export default siteRouter;
