import "./util/secrets";
import errorHandler from "errorhandler";
import app from "./app";

app.use(errorHandler());

const port = app.get("port");
const env = app.get("env");
const server = app.listen(port, () => {
  console.log(`Running at http://localhost:${port} as ${env}`);
  console.log("Press CTRL-C to stop\n");
});

export default server;
