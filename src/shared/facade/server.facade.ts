import { Application } from "express";
import { container, injectable } from "tsyringe";
const bodyParser = require("body-parser");
import { LoggerService } from "../services";
import { IDatabase, ILogger, IServer, ServerConfig, ServerRouter } from "../interfaces";
import { ServerRoute } from "../interfaces/server.interface";
import { Database, Stripe as StripeFacade } from ".";
import { cors, errorMiddleware } from "../middlewares";
import { Res } from "../helper";
import {
  InvoiceStatus,
  StatusCodes,
  SubscriptionStatus,
  TransactionProcessor,
  TransactionStatus,
  TransactionType,
  UserAccountStatus,
} from "../constants";
import { BadRequestError, InternalServerError } from "../errors";
import {
  InvoiceRepository,
  PlanRepository,
  SubscriptionRepository,
  TransactionRepository,
  UserRepository,
} from "../repositories";
const stripe = require("stripe")(`${process.env.STRIPE_API_KEY}`);

@injectable()
export default class Server implements IServer {
  private app: Application;
  private loggerService: ILogger;
  private subscriptionRepository: SubscriptionRepository;
  private planRepository: PlanRepository;
  private userRepository: UserRepository;
  private invoiceRepository: InvoiceRepository;
  private transactionRepository: TransactionRepository;
  private stripeFacade: StripeFacade;
  private database: IDatabase;

  constructor(app: Application) {
    this.app = app;
    this.loggerService = container.resolve(LoggerService);
    this.subscriptionRepository = container.resolve(SubscriptionRepository);
    this.userRepository = container.resolve(UserRepository);
    this.planRepository = container.resolve(PlanRepository);
    this.invoiceRepository = container.resolve(InvoiceRepository);
    this.transactionRepository = container.resolve(TransactionRepository);
    this.database = container.resolve(Database);
    this.stripeFacade = container.resolve(StripeFacade);
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

    this.app.use(cors);

    this.app.post("/webhook", bodyParser.raw({ type: "application/json" }), async (req, res, next) => {
      const endpointSecret = `${process.env.STRIPE_WEBHOOK_SECRET}`;
      const sig = req.headers["stripe-signature"];

      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err: any) {
        Res({
          res,
          code: StatusCodes.UNAUTHORIZED,
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
          const { id, current_period_end, current_period_start, items, customer } = event.data.object;

          const userData = await this.userRepository.fetchOneByCustomerId(customer);

          if (userData?.isFirstLogin) {
            await this.userRepository.updateAccountStatus(
              userData.stripe_customer_id ? userData.stripe_customer_id : "",
              UserAccountStatus.ACTIVE,
            );
          }

          const userId = await this.database.convertStringToObjectId(userData?._id!);
          const plan = await this.planRepository.fetchOneByStripePlanId(items.data[0].plan.id);
          const planId = await this.database.convertStringToObjectId(plan?._id!);

          const response = await this.subscriptionRepository.create({
            user: userId,
            plan: planId,
            stripe_subscription_id: id,
            status: SubscriptionStatus.INCOMPLETE,
            start_date: new Date(current_period_start),
            end_date: new Date(current_period_end),
            amount: Number(items.data[0].plan.amount).toString(),
          });

          await this.userRepository.update(userData?._id!, {
            active_plan: planId
          })

          if (!response) {
            throw new InternalServerError("failed to add subscription to records", {
              awsId: userData?.awscognito_user_id,
            });
          }

          await this.loggerService.log("successfully subscribed customer to a plan", {
            awsId: userData?.awscognito_user_id,
          });

          //TODO: send notification when user successfully subscribes to a plan
          break;
        case "customer.subscription.deleted":
          const customerSubscriptionDeletedData = event.data.object;

          await this.subscriptionRepository.updateByStripeSubId(customerSubscriptionDeletedData.id, {
            status: SubscriptionStatus.CANCELLED
          });

          await this.userRepository.updateWithCustomerId(customerSubscriptionDeletedData.customer, {
            active_plan: undefined
          });
          //TODO:add push notification 

          //TODO:add logger when subcription is cancelled

          break;
        case "customer.subscription.updated":
          const {} = event.data.object;
          break;
        case "setup_intent.created":
          const {} = event.data.object;

          break;
        case "setup_intent.succeeded":
          const setupIntentSucceeded = event.data.object;

          const card_details = await this.stripeFacade.fetchCardDetails({
            payment_method_id: setupIntentSucceeded.payment_method,
            stripe_customer_id: setupIntentSucceeded.metadata.customer,
          });

          if (!card_details) {
            throw new BadRequestError("Failed to fetch cards");
          }

          await this.userRepository.updateWithCustomerId(setupIntentSucceeded.metadata.customer, {
            stripe_card_id: setupIntentSucceeded.payment_method,
            stripe_card_last_digits: card_details.last4,
            stripe_card_expire_date: `${card_details.exp_month}/${card_details.exp_year}`,
            stripe_card_type: card_details.brand,
          });

          await this.loggerService.log("successfully add card to user account", {
            awsId: setupIntentSucceeded.metadata.user_cognito_id,
          });

          //TODO: send notification saying the card has successfully been added

          break;
        case "setup_intent.setup_failed":
          const {} = event.data.object;
          break;
        case "payment_intent.created":
          const paymentIntentCreatedData = event.data.object;

          const invoice = await this.invoiceRepository.fetchOneByStripeId(paymentIntentCreatedData.invoice);

          if (!invoice) {
            throw new BadRequestError("failed to find invoice");
          }

          await this.transactionRepository.create({
            amount: Number(paymentIntentCreatedData.amount_received).toString(),
            status: TransactionStatus.PENDING,
            processor: TransactionProcessor.STRIPE,
            invoice_id: await this.database.convertStringToObjectId(invoice?._id!),
            type: TransactionType.BILL,
          });

          break;
        case "payment_intent.canceled":
          const paymentIntentCancelledData = event.data.object;

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
        case "invoice.created":
          const invoiceCreatedData = event.data.object;

          const invoiceDetail = await this.invoiceRepository.fetchOneByStripeId(invoiceCreatedData.id);

          await this.invoiceRepository.create({
            amount: invoiceCreatedData.amount_remaining,
            subscription_id: await this.database.convertStringToObjectId(invoiceDetail?._id!),
            stripe_invoice_id: invoiceCreatedData.id,
            status: InvoiceStatus.DRAFT,
          });

          break;
        case "invoice.finalized":
          const invoiceFinalizedData = event.data.object;

          await this.invoiceRepository.updateByStripeId(invoiceFinalizedData.id, {
            amount: Number(invoiceFinalizedData.amount_remaining).toString(),
            status: InvoiceStatus.OPEN,
          });

          break;
        case "invoice.finalization_failed":
          const invoiceFinalizationFailedData = event.data.object;

          await this.invoiceRepository.updateByStripeId(invoiceFinalizationFailedData.id, {
            amount: Number(invoiceFinalizationFailedData.amount_remaining).toString(),
            status: InvoiceStatus.VOID,
          });

          break;
        case "invoice.paid":
          const invoicePaidData = event.data.object;

          const invoiceData = await this.invoiceRepository.updateByStripeId(invoicePaidData.id, {
            amount: Number(invoicePaidData.amount_remaining).toString(),
            status: InvoiceStatus.PAID,
          });
          
          await this.transactionRepository.updateByInvoiceId(invoiceData?._id!, {
            status: TransactionStatus.SUCCESS,
          });

          await this.subscriptionRepository.updateByStripeSubId(invoicePaidData.subscription, {
            status: SubscriptionStatus.ACTIVE,
          });

          //TODO: sent notification saying monthly charge has been deducted

          break;
        case "invoice.payment_failed":
          const invoicePaymentFailedData = event.data.object;

          await this.subscriptionRepository.updateByStripeSubId(invoicePaidData.subscription, {
            status: SubscriptionStatus.ACTIVE,
          });

          await this.transactionRepository.updateByInvoiceId(invoicePaidData.subscription, {
            status: TransactionStatus.FAILED,
          });

          //TODO: send notification saying we couldn't charge your card

          break;
        case "invoice.payment_action_required":
          const paymentActionRequiredData = event.data.object;

          // TODO: send notification saying action is needed for payment method
          break;
        case "invoice.updated":
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

      res.send();
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
