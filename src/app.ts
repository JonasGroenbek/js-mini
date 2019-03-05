import express from "express";
import compression from "compression";
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import dotenv from "dotenv";
import mongo from "connect-mongo";
import path from "path";
import mongoose from "mongoose";
import expressValidator from "express-validator";
import bluebird from "bluebird";
import hbs from "express-handlebars";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

const MongoStore = mongo(session);

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env.example" });

// Load controllers
import * as homeController from "./controllers/home";

// Create Express server
const app = express();

// Connect to MongoDB0
// const mongoUrl = MONGODB_URI;
// (<any>mongoose).Promise = bluebird;
// mongoose.connect(mongoUrl, {useMongoClient: true}).then(
//   () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
// ).catch(err => {
//   console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
//   // process.exit();
// });

// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "hbs");
app.engine( 'hbs', hbs( {
  extname: 'hbs',
  layoutsDir: __dirname + '../views/',
  partialsDir: __dirname + '../views/partials/'
}));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET,
}));

app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

app.get("/", homeController.index);

export default app;