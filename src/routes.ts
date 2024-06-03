import { Router, raw } from "express";
import { ServerRouter } from "./shared/interfaces";
import { StatusCodes } from "./shared/constants";
import { customerAuthRouter } from "./modules/auth/routers";
import { adminPlanRouter, subscriptionRouter } from "./modules/subcription/routers";
import { cardRouter } from "./modules/payment/routers";
import { fileManagerRouter, fileRouter, folderRouter } from "./modules/filemanager/routers";
import { Stripe } from "./shared/facade";
import { container } from "tsyringe";

export const router = Router({});
export const stripeRouter = Router({});
const stripe = container.resolve(Stripe);
router.get("/", async (_req, res, _next) => {
  try {
    res.send({ statusCode: StatusCodes.OK, message: "successfully passed healthcheck" });
    res.status(StatusCodes.OK);
  } catch (error: any) {
    res.send(error.message);
    res.status(StatusCodes.SERVICE_UNAVAILABLE).send();
  }
});

stripeRouter.post("/", raw({ type: "application/json" }), async (req, res, next) =>
  stripe.accountWebhook(req, res, next),
);

export const routes: ServerRouter[] = [
  {
    base: "",
    routes: [
      {
        path: "/healthcheck",
        router: router,
      },
      {
        path: "/stripeaccountwebhook",
        router: stripeRouter,
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
