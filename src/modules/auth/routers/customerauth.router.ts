import { Request, Response, NextFunction, Router } from "express";
import { container } from "tsyringe";
import { CustomerAuthController } from "../controllers";

const customerAuthRouter = Router();
const customerAuthController = container.resolve(CustomerAuthController);

customerAuthRouter.post("/signup", (req: Request, res: Response, next: NextFunction) =>
  customerAuthController.signUp(req, res, next),
);
customerAuthRouter.post("/confirm-signup", (req: Request, res: Response, next: NextFunction) =>
  customerAuthController.confirmSignUp(req, res, next),
);
customerAuthRouter.post("/resend-code", (req: Request, res: Response, next: NextFunction) =>
  customerAuthController.resendSignupConfirmationCode(req, res, next),
);
customerAuthRouter.post("/signin", (req: Request, res: Response, next: NextFunction) =>
  customerAuthController.signIn(req, res, next),
);
customerAuthRouter.post("/signout", (req: Request, res: Response, next: NextFunction) =>
  customerAuthController.signOut(req, res, next),
);
customerAuthRouter.post("/forgotpassword", (req: Request, res: Response, next: NextFunction) =>
  customerAuthController.forgotpassword(req, res, next),
);
customerAuthRouter.post("/confirm-forgotpassword", (req: Request, res: Response, next: NextFunction) =>
  customerAuthController.confirmForgotpassword(req, res, next),
);
customerAuthRouter.post("/refresh-access-token", (req: Request, res: Response, next: NextFunction) =>
  customerAuthController.refreshAccessToken(req, res, next),
);

export default customerAuthRouter;
