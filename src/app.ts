import config from "./util/secrets";
import logger from "./util/logger";
import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import lusca from "lusca";
import path from "path";
import expressValidator from "express-validator";
import hbs from "express-handlebars";
import router from "./controllers/router";
import session from "express-session";
import {handlebarsErrorHandler} from "./util/formErrors";
import {messengerRenderer} from "./util/messenger";
import {handlebarsHelperLogger, ifIn, markdownRenderer, positionGoogleMapsLink} from "./util/handlebars";

const app = express();

app.set("port", config.getOrDefault("PORT", 3000));
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "hbs");
app.engine("hbs", hbs({
    extname: "hbs",
    layoutsDir: path.join(__dirname + "/../views/layouts"),
    partialsDir: path.join(__dirname + "/../views/partials"),
    helpers: {
        formErrors: handlebarsHelperLogger(handlebarsErrorHandler, logger),
        positionGoogleMapsLink: handlebarsHelperLogger(positionGoogleMapsLink, logger),
        markdownRenderer: handlebarsHelperLogger(markdownRenderer, logger),
        messengerRenderer: handlebarsHelperLogger(messengerRenderer, logger),
        ifIn: handlebarsHelperLogger(ifIn, logger),
    }
}));

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
app.use(expressValidator());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use(session({secret: config.get("SESSION_SECRET")}));

app.use(
    express.static(path.join(__dirname, "public"), {maxAge: 31557600000})
);

app.use(router);

export default app;