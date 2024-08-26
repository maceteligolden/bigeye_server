import { Router } from "express";
import AIController from "./ai.controller";
import { container } from "tsyringe";

const aiRouter = Router();
const aiController = container.resolve(AIController);

aiRouter.post("/prompt", (req, res, next) => aiController.prompt(req, res, next));

export default aiRouter;
