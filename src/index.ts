import "reflect-metadata";
import express from "express";
import "dotenv/config";
import { Server } from "./shared/helper";
import { cors } from "./shared/middlewares";
import { routes } from "./routes";

const app = express();
const server = new Server(app);
server.config({
  middlewares: [express.json(), express.urlencoded({ extended: true }), cors],
  routes,
});
server.start();
