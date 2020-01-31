import { NextFunction, Request, Response, Router } from "express";
import request from "request";
import crypto from "crypto";
//import { body } from "express-validator";

class LinesController {

    path: string;
    router: Router;

    constructor() {
        this.path = '/line/webhook';
        this.router = Router();
        this.initRouter();
    }

    initRouter() {
        this.router.get("/", this.index);  
        this.router.post("/", this.post);
    }

    public async index(req: Request, res: Response) {
        // Adds support for GET requests to our webhook
        console.log('INDEX');
        return res.send("LOL");
    }

    public async post(req: Request, res: Response) {
        let body = req.body;
        const isVerified = LINEController.verifySignature(req.header("X-Line-Signature"), JSON.stringify(body));
        if(!isVerified){
            return res.status(403).json({"message": "Not verify."});
        }
        console.log('POSTTTT', req.body);
        return res.send(req.body);
    }

    public async put(req: Request, res: Response, next: NextFunction) {


    }


    public async patch(req: Request, res: Response) {

    }

    verifySignature = (xLineSignature: string, body: any): boolean => {
        const channelSecret = process.env.LINE_CHANNEL_SECRET;
        const signature = crypto
          .createHmac('SHA256', channelSecret)
          .update(body).digest('base64');
        return signature === xLineSignature;
    }
}

export const LINEController = new LinesController();
export const LINERouter = LINEController.router;

