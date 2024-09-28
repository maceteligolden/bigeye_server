import { Router } from "express";
import { ServerRouter } from "./shared/interfaces";
import { StatusCodes } from "./shared/constants";
import { customerAuthRouter } from "./modules/auth/routers";
import { fileManagerRouter, fileRouter, folderRouter } from "./modules/filemanager/routers";
import { accountRouter } from "./modules/account/routes";
import notificationRouter from "./modules/notification/notification.router";
import blogRouter from "./modules/blog/blog.router";

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
        path: "/notification",
        router: notificationRouter,
      },
      {
        path: "/blogs",
        router: blogRouter,
      },
    ],
  },
  {
    base: "admin",
    routes: [],
  },
];
