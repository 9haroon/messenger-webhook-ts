import App from "./app";
import { MessengerController } from "./controllers/messenger.controller";
import { LINEController } from "./controllers/line.controller";

const app = new App(
	[
		MessengerController,
		LINEController
	]
);

app.listen();