import { Router } from "express";
import AIController from "./ai.controller";
import { container } from "tsyringe";
import AIWebsocket from "./ai.websocket";
import { authMiddleware } from "../../shared/middlewares";

const aiRouter = Router();
const aiController = container.resolve(AIController);
const aiWebsocket = container.resolve(AIWebsocket);

aiRouter.post("/prompt", authMiddleware, (req, res, next) => aiController.prompt(req, res, next));
aiRouter.post("/prompt-newton", (req, res, next) => aiWebsocket.send(req, res, next));
aiRouter.post("/start-chat", (req, res, next) => aiWebsocket.connect(req, res, next));
aiRouter.post("/stop-chat", (req, res, next) => aiWebsocket.disconnect(req, res, next));

export default aiRouter;
