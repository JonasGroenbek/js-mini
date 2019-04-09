import winston, {Logger} from "winston";

export default new Logger({
    transports: [
        new (winston.transports.Console)({level: process.env.NODE_ENV === "production" ? "error" : "info"}),
        new (winston.transports.File)({filename: "debug.log", level: "debug"})
    ]
});