import logger from "./logger";
import fs from "fs";
import dotenv from "dotenv";

export const environment = process.env.NODE_ENV;
const config = new Map<String, String>();
const loaded = dotenv.config();

// An error occurred while reading configuration file.
if (loaded.error) {
    logger.error("There was an error while parsing the .env file.");
    logger.error(loaded.error.message)
    process.exit(1)
}

// Load configuration key-value pairs.
if (loaded.parsed) {
    const keys = Object.keys(loaded.parsed);
    logger.info("Using .env file to supply configuration values.");
    logger.info(`Found ${keys.length} configuration pairs.`);
    keys.forEach(key => {
        config.set(key, loaded.parsed[key]);
    });
}

export default config;