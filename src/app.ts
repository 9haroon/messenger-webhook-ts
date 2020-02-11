import express, { Request, Response, Router } from 'express';
import https from "https";
import path from "path";
import { cleanEnv, port, str, CleanEnv } from "envalid";
import dotenv from "dotenv";
import fs from "fs";
import bodyParser from 'body-parser';

interface IController {
  path: string;
  router: Router;
}

class App {

  public app: express.Application;
  private env: CleanEnv;
  constructor(controllers: IController[]) {
    this.app = express();
    // this.connectDatabase();
    this.validateEnv();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    // this.initializeErrorHandling();
  }

  public listen() {
    if(!this.env.isDev) {
      https.createServer(
      {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem'),
        passphrase: process.env.SSL_PASSPHASE
      },
      this.app).listen(process.env.PORT, ()=>{
        console.log(`Dev App listening on the port ${process.env.PORT}`);
      });  
    }else {
      this.app.listen(process.env.PORT, () => {
        console.log(`Production App listening on the port ${process.env.PORT}`);
      });
    }
    
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
    this.app.get('/', (req, res) => {
        res.send('Hello world');
    });
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
    this.env = cleanEnv(process.env, {
      NODE_ENV: str(),
      PORT: port(),
      FACEBOOK_VERIFY_TOKEN: str(),
      LINE_CHANNEL_SECRET: str(),
      LINE_CHANNEL_ACCESS_TOKEN: str()
    });
    if(this.env.isDev) {
      cleanEnv(process.env, {
        SSL_PASSPHASE: str()
      });
    }

  }

}

export default App;
