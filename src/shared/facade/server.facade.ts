import { Application } from "express";
import { container, injectable } from "tsyringe";
const bodyParser = require("body-parser");
import { LoggerService } from "../services";
import { IDatabase, ILogger, IServer, ServerConfig, ServerRouter } from "../interfaces";
import { ServerRoute } from "../interfaces/server.interface";
import { Database } from ".";
import { errorMiddleware } from "../middlewares";
import { Res } from "../helper";
import { StatusCodes, SubscriptionStatus } from "../constants";
import { InternalServerError } from "../errors";
import { SubscriptionRepository } from "../repositories";
const stripe = require("stripe")(
  `${process.env.STRIPE_API_KEY}`
);

@injectable()
export default class Server implements IServer {
  private app: Application;
  private loggerService: ILogger;
  private subscriptionRepository: SubscriptionRepository;
  private database: IDatabase;

  constructor(app: Application) {
    this.app = app;
    this.loggerService = container.resolve(LoggerService);
    this.subscriptionRepository = container.resolve(SubscriptionRepository);
    this.database = container.resolve(Database);
  }

  async start(): Promise<void> {
    const PORT = process.env.PORT;
    this.app.listen(PORT, () => {
      this.loggerService.log(`server listening to ${PORT}`);
      this.database.connect();
    });
  }

  config(args: ServerConfig): void {
    const { middlewares, routes } = args;

    const BASE_URL = process.env.BASE_URL;

    this.app.post("/webhook", bodyParser.raw({ type: "application/json" }), async (req, res, next) => {
      const endpointSecret = `${process.env.STRIPE_WEBHOOK_SECRET}`;
      const sig = req.headers["stripe-signature"];
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err: any) {
        console.log(err);
        Res({
          res,
          code: StatusCodes.INTERNAL_SERVER,
          message: `webhook error: ${err.message}`,
        });
        return;
      }

      switch (event.type) {
        case "customer.created":
          const customer_created = event.data.object;

          await this.loggerService.log("successfully created stripe customer", {
            name: customer_created.name,
            email: customer_created.email,
          });

          break;
        case "customer.deleted":
          const customer_deleted = event.data.object;

          await this.loggerService.log("successfully deleted stripe customer", {
            id: customer_deleted.id,
          });

          break;
        case "customer.updated":
          const customer_updated = event.data.object;

          await this.loggerService.log("successfully updated stripe customer", {
            name: customer_updated.name,
            email: customer_updated.email,
          });
          break;
        case "customer.subscription.created":
          const { id, current_period_end, current_period_start, items, metadata } = event.data.object;

          const response = await this.subscriptionRepository.create({
            user: await this.database.convertStringToObjectId(metadata.user),
            plan: await this.database.convertStringToObjectId(metadata.plan),
            stripe_subscription_id: id,
            status: SubscriptionStatus.ACTIVE,
            start_date: new Date(current_period_start),
            end_date: new Date(current_period_end),
            amount: Number(items.data[0].plan.amount).toString(),
          });

          if (!response) {
            throw new InternalServerError("failed to add subscription to records", {
              name: customer_updated.name,
              email: customer_updated.email,
            });
          }

          await this.loggerService.log("successfully subscribed customer to a plan", {
            name: customer_updated.name,
            email: customer_updated.email,
          });
          break;
        case "customer.subscription.deleted":
          const {} = event.data.object;
          break;
        case "customer.subscription.updated":
          const {} = event.data.object;
          break;
        case "setup_intent.created":
          const {} = event.data.object;

          break;
        case "setup_intent.succeeded":
          const {} = event.data.object;

          break;
        case "setup_intent.setup_failed":
          const {} = event.data.object;
          break;
        case "payment_intent.created":
          const {} = event.data.object;
          break;
        case "payment_intent.payment_failed":
          const {} = event.data.object;
          break;
        case "payment_intent.succeeded":
          const {} = event.data.object;
          break;
        case "plan.created":
          const {} = event.data.object;
          break;
        case "plan.deleted":
          const {} = event.data.object;
          break;
        case "plan.updated":
          const {} = event.data.object;
          break;
        case "price.created":
          const {} = event.data.object;
          break;
        case "price.deleted":
          const {} = event.data.object;
          break;
        case "price.updated":
          const {} = event.data.object;
          break;
        case "subscription_schedule.canceled":
          const {} = event.data.object;
          break;
        case "subscription_schedule.completed":
          const {} = event.data.object;
          break;
        case "subscription_schedule.created":
          const {} = event.data.object;

          await this.loggerService.log("subscription plan will expire in 7 days");
          break;
        case "subscription_schedule.expiring":
          const {} = event.data.object;

          await this.loggerService.log("subscription plan will expire in 7 days");
          break;
        case "subscription_schedule.updated":
          const {} = event.data.object;
          break;
        default:
          Res({
            res,
            code: StatusCodes.INTERNAL_SERVER,
            message: `Unhandled event type: ${event.type}`,
          });
      }

      res.status(200).send();
    });

    middlewares.map((middleware: any) => {
      this.app.use(middleware);
    });

    routes.map((router: ServerRouter) => {
      const URL = router.base ? `/${BASE_URL}/${router.base}` : `/${BASE_URL}`;

      router.routes.map((route: ServerRoute) => {
        this.app.use(`${URL}${route.path}`, route.router);
      });
    });

    this.app.use(errorMiddleware); // dont move this else error wont be caught
  }
}
