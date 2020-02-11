import { NextFunction, Request, Response, Router } from "express";
import request from "request";
import crypto from "crypto";
//import { body } from "express-validator";

class LinesController {

    path: string;
    router: Router;
    channelSecret: string;

    constructor() {
        this.channelSecret = process.env.LINE_CHANNEL_SECRET;
        this.path = '/line/webhook';
        this.router = Router();
        this.initRouter();
    }

    initRouter() {
        this.router.get("/", this.index);  
        this.router.post("/", this.webhook);
    }

    public async index(req: Request, res: Response) {
        // Adds support for GET requests to our webhook
        console.log('INDEX');
        return res.send("LOL");
    }

    public async webhook(req: Request, res: Response) {
        let body = req.body;
        const isVerified = LINEController.verifySignature(req.header("X-Line-Signature"), JSON.stringify(body));
        if(!isVerified){
            return res.status(403).json({"message": "Not verify."});
        }
        console.log('POSTTTT', req.body);
        console.log('Msg', req.body.events[0].source);
        const userId = req.body.events[0].source.userId;
        await LINEController.sendMessage(userId);
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

    sendMessage = (to: string) => {
        const channelSecret = process.env.LINE_CHANNEL_ACCESS_TOKEN;
        const url = 'https://api.line.me/v2/bot/message/push';
        const header = {
            Authorization: 'Bearer '+channelSecret
        }
        const body = {
            to,
            messages:[
                {
                    "type":"text",
                    "text":"Hello, world1"
                },
                {
                    "type":"text",
                    "text":"Hello, world2"
                },
                {
                    "type":"text",
                    "text":"Hello, world3"
                },
                {
                    "type":"text",
                    "text":"Hello, world4"
                }
            ]
        }
        return new Promise((resolve, reject) => {
            request({
                headers: header,
                "uri": url,
                //"qs": { "access_token": process.env.FACEBOOK_PAGE_TOKEN },
                "method": "POST",
                "json": body
            }, (err, res, body) => {
                if (!err) {
                    console.log('res', res.headers);
                    console.log('body', body);
                    resolve(body);
                } else {
                    console.error("Unable to send message:" + err);
                    reject(err);
                }
            });  
        })

    }
}

export const LINEController = new LinesController();
export const LINERouter = LINEController.router;

