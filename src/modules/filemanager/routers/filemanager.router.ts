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

fileManagerRouter.patch("/move", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  fileManagerController.move(req, res, next),
);

fileManagerRouter.patch("/copy", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  fileManagerController.copy(req, res, next),
);

fileManagerRouter.patch("/rename", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  fileManagerController.rename(req, res, next),
);

export default fileManagerRouter;
