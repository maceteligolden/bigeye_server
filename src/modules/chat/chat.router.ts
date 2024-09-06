import { Request, Response, NextFunction, Router } from "express";
import ChatController from "./chat.controller";
import { container } from "tsyringe";
import { authMiddleware } from "../../shared/middlewares";

const chatRouter = Router();
const chatController = container.resolve(ChatController);

chatRouter.post("/create", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  chatController.createChat(req, res, next),
);
chatRouter.get("/", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  chatController.getChats(req, res, next),
);
chatRouter.get("/:chat_id", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  chatController.getChat(req, res, next),
);
chatRouter.patch("/rename/:chat_id", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  chatController.rename(req, res, next),
);
chatRouter.delete("/:chat_id", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  chatController.delete(req, res, next),
);

export default chatRouter;
