import { container } from "tsyringe";
import { FileController } from "../controllers";
import { Request, Response, NextFunction, Router } from "express";
import { authMiddleware, fileMiddleware } from "../../../shared/middlewares";

const fileRouter = Router();
const fileController = container.resolve(FileController);

fileRouter.post(
  "/upload",
  authMiddleware,
  fileMiddleware.array("files"),
  (req: Request, res: Response, next: NextFunction) => fileController.upload(req, res, next),
);

fileRouter.patch("/move", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  fileController.move(req, res, next),
);

fileRouter.patch("/copy", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  fileController.copy(req, res, next),
);

export default fileRouter;
