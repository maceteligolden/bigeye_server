import { Router } from "express";
import { ServerRouter } from "./shared/interfaces";

export const router = Router({});
router.get("/", async (_req, res, _next) => {
  try {
    res.send({ statusCode: 200 });
    res.status(200);
  } catch (error: any) {
    res.send(error.message);
    res.status(503).send();
  }
});

export const routes: ServerRouter[] = [
  {
    base: "",
    routes: [
      {
        path: "/healthcheck",
        router: router,
      },
    ],
  },
];
