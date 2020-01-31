import { NextFunction, Request, Response, Router } from "express";
import request from "request";
//import { body } from "express-validator";

class MessengersController {

    path: string;
    router: Router;

    constructor() {
        this.path = '/facebook/webhook';
        this.router = Router();
        this.initRouter();
    }

    initRouter() {
        this.router.get("/", this.index);  
        this.router.post("/", this.create);
    }

    public async index(req: Request, res: Response) {
        // Adds support for GET requests to our webhook
        // Your verify token. Should be a random string.
        let VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN;
          
        // Parse the query params
        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];
          
        // Checks if a token and mode is in the query string of the request
        if (mode && token) {
        
          // Checks the mode and token sent is correct
          if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            
            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            return res.status(200).send(challenge);
          
          } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            return res.send(403).json({message: "Not Verify."});   
          }
        }else{
            return res.sendStatus(403)
        }
        
    }

    public async create(req: Request, res: Response) {
        // Creates the endpoint for our webhook 
        let body = req.body;

        // Checks this is an event from a page subscription
        if (body.object === 'page') {
          //console.log(body);
          // Iterates over each entry - there may be multiple if batched
          body.entry.forEach(function(entry: any) {

            // Gets the message. entry.messaging is an array, but 
            // will only ever contain one message, so we get index 0
            let webhook_event = entry.messaging[0];
            //console.log(webhook_event);
            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);
 
            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                console.log('message', webhook_event.message);
                //MessengerController.callSendAPI(sender_psid, "Got it dude");
            } else if (webhook_event.postback) {
                console.log('postback', webhook_event.postback);
            }
          });

          // Returns a '200 OK' response to all requests
          res.status(200).send('EVENT_RECEIVED');
        } else {
          // Returns a '404 Not Found' if event is not from a page subscription
          res.sendStatus(404);
        }
    }

    public async put(req: Request, res: Response, next: NextFunction) {


    }


    public async patch(req: Request, res: Response) {

    }

    // Sends response messages via the Send API
    callSendAPI = (recipient_psid: string, responseMsg: string, cb:any = null) => {
        // Construct the message body
        let request_body = {
            "recipient": {
                "id": recipient_psid
            },
            "message": {text: responseMsg}
        };
     
        // Send the HTTP request to the Messenger Platform
        request({
            "uri": "https://graph.facebook.com/v5.0/me/messages",
            "qs": { "access_token": process.env.FACEBOOK_PAGE_TOKEN },
            "method": "POST",
            "json": request_body
        }, (err, res, body) => {
            if (!err) {
                console.log('body', body)
                if(cb){
                    cb();
                }
            } else {
                console.error("Unable to send message:" + err);
            }
        });
    }
}

export const MessengerController = new MessengersController();
export const MessengerRouter = MessengerController.router;

