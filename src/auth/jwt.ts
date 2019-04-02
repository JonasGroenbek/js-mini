import AuthenticatableUser from "./AuthenticatableUser";
import jwt from "jsonwebtoken";
import secrets from "../util/secrets";

/**
 * The function that returns the jwt secret.
 */
export type JwtConfiguration = {

    /**
     * The algorithm to use to create jwt.
     */
    algorithm?: string,

    /**
     * A function that returns the secret to sign the jwt with.
     */
    getSecret: () => Promise<string>,
};

/**
 * Fulfils the GetSecret interface, by returning a value from the configuration file.
 * @param key The key the secret is stored under.
 */
export function getSecretFromConfig(key: string): () => Promise<string> {
    return () => new Promise((resolve, reject) => {
        try {
            resolve(secrets.getOrThrow(key));
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Creates a new jwt module, configured using the provided algorithm and secret provider.
 * @param configuration The configuration to use when signing and verifying jwt.
 */
export default function config(configuration: JwtConfiguration) {

    const defaults = {algorithm: "HS256"};
    configuration = Object.assign(defaults, configuration);

    /**
     * Encodes the provided user and extra information into a jwt.
     * @param user The user to encode.
     * @param extras The extra information to encode. Is included in the jwt.
     * @returns A promise resolving to the generated token.
     */
    async function encode(user: AuthenticatableUser, extras: {} = {}) {
        const payload = Object.assign({user}, extras);
        const secret = await configuration.getSecret();

        return await jwt.sign(payload, secret, {
            algorithm: configuration.algorithm
        });
    }

    /**
     * Decodes the provided token using the secret.
     * @param token The token to verify.
     * @returns A promise resolving to the decoded token contents.
     */
    async function verify(token: string) {
        const secret = await configuration.getSecret();
        const options = {algorithms: [configuration.algorithm]};

        return jwt.verify(token, secret, options);
    }

    return {encode, verify};
}