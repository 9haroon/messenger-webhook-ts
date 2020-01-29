import express, { Request, Response, Router } from 'express';
import { cleanEnv, port, str } from "envalid";
import dotenv from "dotenv";
import fs from "fs";
import bodyParser from 'body-parser';

interface IController {
  path: string;
  router: Router;
}

class App {

  public app: express.Application;

  constructor(controllers: IController[]) {
    this.app = express();
    // this.connectDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    // this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeErrorHandling() {
    //this.app.use(errorMiddleware);
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }

  private initializeControllers(controllers: IController[]) {
    controllers.forEach((controller) => {
      this.app.use('/api' + controller.path, controller.router);
    });
  }

  private connectDatabase() {
    
  }

  private validateEnv() {
    if (fs.existsSync(".env")) {
        console.log("Using .env file to supply config environment variables");
        dotenv.config({ path: ".env" });
    } else {
        dotenv.config({ path: ".env.example" });  // you can delete this after you create your own .env file!
        console.log("Using .env.example file to supply config environment variables");
    }
    const env = cleanEnv(process.env, {
      NODE_ENV: str(),
      PORT: port(),
    });

  }

}

export default App;



/*
import { cleanEnv, port, str } from "envalid";
import dotenv from "dotenv";
import fs from "fs";


function validateEnv() {
  if (fs.existsSync(".env")) {
      console.log("Using .env file to supply config environment variables");
      dotenv.config({ path: ".env" });
  } else {
      dotenv.config({ path: ".env.example" });  // you can delete this after you create your own .env file!
      console.log("Using .env.example file to supply config environment variables");
  }
  const env = cleanEnv(process.env, {
    NODE_ENV: str(),
    JWT_SECRET: str(),
    PORT: port(),
    SENDINBLUE_API_KEY: str(),
    PRIMARY_EMAIL: str(),
    PRIMARY_NAME: str(),
    SMSPOH_API_KEY: str(),
    GOOGLE_CLIENT_ID: str(),
    GOOGLE_CLIENT_SECRET: str(),
    FACEBOOK_APP_ID: str(),
    FACEBOOK_APP_SECRET: str()
  });
  if(env.isProduction || env.isDevelopment){
    cleanEnv(process.env, {
      MONGODB_URI: str(),
    });
  }else{
    cleanEnv(process.env, {
      MONGODB_URI_LOCAL: str(),
    });
  }
  
}

export default validateEnv;

 */