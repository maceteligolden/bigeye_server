import { Request, Response, NextFunction, Router } from "express";
import { container } from "tsyringe";
import { authMiddleware } from "../../../shared/middlewares";
import { CodeController } from "../controllers";

const codeRouter = Router();
const accountController = container.resolve(CodeController);

codeRouter.get("/", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  accountController.getCodes(req, res, next),
);

codeRouter.get("/:id", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  accountController.getCode(req, res, next),
);

codeRouter.post("/download", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  accountController.download(req, res, next),
);

export default codeRouter;
