import express, { Application } from "express";
import Controller from "@/interfaces/controller.interface";
import errorMiddleware from "@/app/middleware/restMiddleware/errorMiddleware";
//import { morganMiddleware } from "@/configs/logger";
//import  DbConn from "@/configs/DbConn";
import createGraphQLServer from "@/graphql/index";
import correlationIdMiddleware from "@/config/correlationId";
import { httpLogger } from "./logging/httplogger";
import graphqlHttpStatus from "@/graphql/utils/graphqlHttpStatus";

//import { encryptSecret, decryptSecret } from "@/helpers/crypto.helper"

class App {
    public express: Application;
    public port: number; 
    
    constructor (public controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        this.initializeMiddleware();
        this.initializeRoutes(controllers);
        this.initializeGraphql()
        this.initializeErrorMiddleware();
        
    }


    //MIDDLEWARE INITIALIZERS
     private async initializeMiddleware(): Promise<void> {
        this.express.use(express.json());
        this.express.use(correlationIdMiddleware)
        //this.express.use(morganMiddleware);  
        // Apply middleware at the top
        this.express.use(httpLogger); 
        this.express.use(graphqlHttpStatus);
    }


    //ROUTE INITIALIZERS
    private initializeRoutes(controllers: Controller[]): void {
        controllers.forEach((controller) => {
            this.express.use("/api/V1", controller.route);
        });
    }

    private async initializeGraphql(): Promise<void> {
        const graphqlServer = await createGraphQLServer();
        this.express.use("/graphql", graphqlServer);
    }


    //ERROR MIDDLEWARE INITIALIZER
    private initializeErrorMiddleware(): void {
        this.express.use(errorMiddleware);
    }

    //DB CONNECTION INITIALIZER
    public async initializeDbConnection(): Promise<void> {
        // Database connection logic here
        //await DbConn()
    }
    

    //SERVER LISTENER
    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`🚀 Server running on port ${this.port}`);
        });
    }
}


export default App; 