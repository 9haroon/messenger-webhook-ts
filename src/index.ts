import App from "./app";
import { MessengerController } from "./controllers/messenger.controller";

const app = new App(
	[
		MessengerController
	]
);

app.listen();