import { container } from "tsyringe";
import { FolderController } from "../controllers";
import { Request, Response, NextFunction, Router } from "express";
import { authMiddleware } from "../../../shared/middlewares";

const folderRouter = Router();
const folderController = container.resolve(FolderController);

folderRouter.post("/create", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  folderController.create(req, res, next),
);

folderRouter.patch("/rename", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  folderController.rename(req, res, next),
);

folderRouter.patch("/move", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  folderController.move(req, res, next),
);

folderRouter.patch("/copy", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  folderController.copy(req, res, next),
);

folderRouter.delete("/:id", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  folderController.delete(req, res, next),
);

export default folderRouter;
