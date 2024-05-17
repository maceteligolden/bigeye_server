import { Response, Router } from "express";
import { StatusCodes } from "../constants";

export interface IServer {
  start(): void;
  config(args: ServerConfig): void;
  response(args: ServerResponse): void;
}

export type ServerConfig = {
  middlewares: any[];
  routes: ServerRouter[];
};

export type ServerRouter = {
  base: string;
  routes: ServerRoute[];
};

export type ServerRoute = {
  path: string;
  router: Router;
};

export type ServerResponse = {
  res: Response;
  message: string;
  code: StatusCodes;
  data?: any;
};
