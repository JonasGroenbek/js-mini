import logger from "./logger";
import config from "./secrets";
import mongoose from "mongoose";

export default function connect(done: (err: Error) => any) {

    const url = config.getOrThrow("MONGO_URL");
    const options = {createIndexes: true, useNewUrlParser: true};

    mongoose.connect(url, options, err => {
        if (err) {
            logger.error("Could not connect to MongoDB:");
            logger.error(err.message);
            done(err);
            return;
        }

        logger.info("Successfully connected to MongoDB.");
        done(undefined);
    });
}