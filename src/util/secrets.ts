import logger from "./logger";
import fs from "fs";

const configuration = new Map<string, string>();
const environment = process.env.NODE_ENV;

Object.keys(process.env).forEach(key => configuration.set(key, process.env[key]));
load(".env");
load(".env." + environment);

/**
 * Loads the configuration values from the provided file, if that file exists.
 * @param file The name of the file from which to load configuration entries.
 */
function load(file: string) {
    if (exists(file)) {
        const content = fs.readFileSync(file).toString();
        const parsed = parse(content);
        logger.info(`Parsed ${parsed.size} configuration value(s) from ${file}`);
        for (const key of parsed.keys()) {
            // @ts-ignore
            configuration.set(key, parsed.get(key));
        }
    }
}

/**
 * Checks that the provided file exists.
 * @param file The file name to check for.
 */
function exists(file: string) {
    return fs.existsSync(file);
}

/**
 * Parses the contents of an environment file.
 * @param content The string content to parse.
 */
function parse(content: string) {
    const result = new Map<String, String>();
    const lines = content.split("\n");
    for (const line of lines) {
        const match = line.match(/^([^=:#]+?)[=:](.*)/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            result.set(key, value);
        }
    }
    return result;
}

class Configuration {

    /**
     * Checks if the configuration entries has a key with the provided name.
     * @param key The key to check for.
     */
    static has(key: string): boolean {
        return configuration.has(key);
    }

    static get(key: string): string | undefined {
        return configuration.get(key);
    }

    static entries(): IterableIterator<[string, string]> {
        return configuration.entries();
    }

    static getOrDefault<T>(key: string, defaultValue: T): string | T {
        if (!Configuration.has(key))
            return defaultValue;

        return Configuration.get(key);
    }

    static getOrThrow(key: string): string {
        const found = configuration.get(key);
        if (found == undefined)
            throw new Error(`Missing configuration key ${key}`);
        return found;
    }

    forEach(callbackfn: (value: string | undefined, key: string, map: Configuration) => void, thisArg?: any): void {
        if (thisArg) {
            callbackfn = callbackfn.bind(thisArg);
        }

        configuration.forEach((value: string, key: string | undefined) => {
            callbackfn(value, key, this);
        });
    }

    readonly size: number = configuration.size;
}

export {environment};
export default new Configuration();