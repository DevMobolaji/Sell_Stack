import express, { Application } from 'express';
import Controller from '@/interfaces/controller.interface';
import { httpLogger } from './logging/httplogger';

import { finalErrorHandler } from './errors/errorHandler';
import createGraphQLServer from '../graphql';
import graphqlHttpStatus from '@/graphql/utils/graphqlHttpStatus';
import { requestLoggerMiddleware } from '@/app/middleware/requestLogger';

class App {
  public express: Application;
  public port: number;

  constructor(public controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;

    this.initializeMiddleware();
    this.initializeRoutes(controllers);
    this.initializeGraphql();
    this.initializeErrorMiddleware();
  }

  // ===============================
  // MIDDLEWARE INITIALIZERS
  // ===============================
  private initializeMiddleware(): void {
    // Parse JSON bodies
    this.express.use(express.json());

    // Request logger (logs request start)
    this.express.use(requestLoggerMiddleware);

    // HTTP logger (logs response finish)
    this.express.use(httpLogger);

    // Optional GraphQL HTTP status logging
    this.express.use(graphqlHttpStatus);
  }

  // ===============================
  // ROUTE INITIALIZERS
  // ===============================
  private initializeRoutes(controllers: Controller[]): void {
    controllers.forEach(controller => {
      this.express.use('/api/V1', controller.route);
    });
  }

  // ===============================
  // GRAPHQL INITIALIZER
  // ===============================
  private async initializeGraphql(): Promise<void> {
    const graphqlServer = await createGraphQLServer();
    this.express.use('/graphql', graphqlServer);
  }

  // ===============================
  // ERROR MIDDLEWARE INITIALIZER
  // ===============================
  private initializeErrorMiddleware(): void {
    // Catch-all error handlers
    this.express.use(finalErrorHandler);
  }

  // ===============================
  // DB CONNECTION PLACEHOLDER
  // ===============================
  public async initializeDbConnection(): Promise<void> {
    // await DbConn(); // implement your DB connection logic here
  }

  // ===============================
  // SERVER LISTENER
  // ===============================
  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`🚀 Server running on port ${this.port}`);
    });
  }
}

export default App;
