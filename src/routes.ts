import { Router } from "express";
import { ServerRouter } from "./shared/interfaces";

export const routes: ServerRouter[] = [
  {
    base: "",
    routes: [{
      path: "/auth",
      router: Router()
    }]
  },
];
