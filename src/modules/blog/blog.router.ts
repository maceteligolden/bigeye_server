import { Router } from "express";
import { container } from "tsyringe";
import BlogController from "./blog.controller";

const blogRouter = Router();
const blogController = container.resolve(BlogController);

export default blogRouter;
