import { Request, Response, NextFunction, Router } from "express";
import { FileManagerController } from "../controllers";
import { container } from "tsyringe";
import { authMiddleware } from "../../../shared/middlewares";

const fileManagerRouter = Router();
const fileManagerController = container.resolve(FileManagerController);

fileManagerRouter.get("/", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  fileManagerController.getAllObjects(req, res, next),
);

fileManagerRouter.delete("/:id", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  fileManagerController.deleteObject(req, res, next),
);

fileManagerRouter.delete("/", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  fileManagerController.deleteManyObject(req, res, next),
);

export default fileManagerRouter;
