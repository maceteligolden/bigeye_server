import { Application } from "express";
import { container, injectable } from "tsyringe";
import { LoggerService } from "../services";
import { IDatabase, ILogger, IServer, ServerConfig, ServerRouter } from "../interfaces";
import { ServerRoute } from "../interfaces/server.interface";
import { Database } from ".";
import { errorMiddleware } from "../middlewares";

@injectable()
export default class Server implements IServer {
  private app: Application;
  private logger: ILogger;
  private database: IDatabase;

  constructor(app: Application) {
    this.app = app;
    this.logger = container.resolve(LoggerService);
    this.database = container.resolve(Database);
  }

  async start(): Promise<void> {
    const PORT = process.env.PORT;
    this.app.listen(PORT, () => {
      this.logger.log(`server listening to ${PORT}`);
      this.database.connect();
    });
  }

  config(args: ServerConfig): void {
    const { middlewares, routes } = args;

    const BASE_URL = process.env.BASE_URL;

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
