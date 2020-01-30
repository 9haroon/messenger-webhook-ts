import App from "./src/app";
import { MessengerController } from "./src/controllers/messenger.controller";

const app = new App(
	[
		MessengerController
	]
);

app.listen();