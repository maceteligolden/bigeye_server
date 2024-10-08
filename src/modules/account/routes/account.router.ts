import { Request, Response, NextFunction, Router } from "express";
import { container } from "tsyringe";
import { authMiddleware } from "../../../shared/middlewares";
import { AccountController } from "../controller";

const accountRouter = Router();
const accountController = container.resolve(AccountController);

accountRouter.patch("/changepassword", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  accountController.changePassword(req, res, next),
);

accountRouter.delete("/", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  accountController.deleteAccount(req, res, next),
);

accountRouter.get("/profile", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  accountController.getAccount(req, res, next),
);

accountRouter.patch("/update-profile", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  accountController.updateAccount(req, res, next),
);

accountRouter.patch("/update-language-preferences", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  accountController.updateLanguagePreference(req, res, next),
);

export default accountRouter;
