import { Request, Response, NextFunction, Router } from "express";
import { container } from "tsyringe";
import { CardController } from "../controller";

const cardRouter = Router();
const cardController = container.resolve(CardController);

cardRouter.post("/authorize-add-card", (req: Request, res: Response, next: NextFunction) =>
  cardController.authorizeAddCard(req, res, next),
);

export default cardRouter;
