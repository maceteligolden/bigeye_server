import { Router } from "express";
import { ServerRouter } from "./shared/interfaces";
import { StatusCodes } from "./shared/constants";
import { customerAuthRouter } from "./modules/auth/routers";
import { adminPlanRouter, planRouter, subscriptionRouter } from "./modules/subcription/routers";
import { cardRouter } from "./modules/payment/routers";
import { fileManagerRouter, fileRouter, folderRouter } from "./modules/filemanager/routers";
import { accountRouter } from "./modules/account/routes";
import { codeRouter } from "./modules/records/routes";
import aiRouter from "./modules/ai/ai.router";
import chatRouter from "./modules/chat/chat.router";

export const router = Router({});

router.get("/", async (_req, res, _next) => {
  try {
    res.send({ statusCode: StatusCodes.OK, message: "successfully passed healthcheck!!!" });
    res.status(StatusCodes.OK);
  } catch (error: any) {
    res.send(error.message);
    res.status(StatusCodes.SERVICE_UNAVAILABLE).send();
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
  {
    base: "customer",
    routes: [
      {
        path: "/auth",
        router: customerAuthRouter,
      },
      {
        path: "/subscriptions",
        router: subscriptionRouter,
      },
      {
        path: "/cards",
        router: cardRouter,
      },
      {
        path: "/folders",
        router: folderRouter,
      },
      {
        path: "/files",
        router: fileRouter,
      },
      {
        path: "/filemanager",
        router: fileManagerRouter,
      },
      {
        path: "/accounts",
        router: accountRouter,
      },
      {
        path: "/payments",
        router: cardRouter,
      },
      {
        path: "/plans",
        router: planRouter,
      },
      {
        path: "/codes",
        router: codeRouter,
      },
      {
        path: "/chat",
        router: chatRouter
      },
      {
        path: "/ai",
        router: aiRouter,
      },
    ],
  },
  {
    base: "admin",
    routes: [
      {
        path: "/plans",
        router: adminPlanRouter,
      },
    ],
  },
];
