import "reflect-metadata";
import express from "express";
import "dotenv/config";
import { Server } from "./shared/facade";
import { cors } from "./shared/middlewares";
import { routes } from "./routes";
import fileUpload from "express-fileupload";

const app = express();
const server = new Server(app);
server.config({
  middlewares: [express.json(), express.urlencoded({ extended: true }), fileUpload(), cors],
  routes,
});
server.start();
