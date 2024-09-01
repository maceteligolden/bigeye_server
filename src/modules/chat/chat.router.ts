import { Request, Response, NextFunction, Router } from "express";
import ChatController from "./chat.controller";
import { container } from "tsyringe";

const chatRouter = Router();
const chatController = container.resolve(ChatController);

chatRouter.post("/create", (req: Request, res: Response, next: NextFunction)=> chatController.createChat(req, res, next));
chatRouter.get("/", (req: Request, res: Response, next: NextFunction)=> chatController.getChats(req, res, next));
chatRouter.patch("/rename/:chat_id", (req: Request, res: Response, next: NextFunction)=> chatController.rename(req, res, next));
chatRouter.delete("/:chat_id", (req: Request, res: Response, next: NextFunction)=> chatController.rename(req, res, next));

export default chatRouter;