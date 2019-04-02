import AuthenticatableUser from "./AuthenticatableUser";
import jwt from "jsonwebtoken";
import secrets from "../util/secrets";

/**
 * The function that returns the jwt secret.
 */
export type GetSecret = () => Promise<string>;

/**
 * Fulfils the GetSecret interface, by returning a value from the configuration file.
 * @param key The key the secret is stored under.
 */
export function getSecretFromConfig(key: string): Promise<String> {
    return new Promise((resolve, reject) => {
        try {
            resolve(secrets.getOrThrow(key));
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Creates a new jwt module, configured using the provided algorithm and secret provider.
 * @param algorithm
 * @param getSecret
 */
export default function config(algorithm: string = "HS512", getSecret: GetSecret) {

    /**
     * Encodes the provided user and extra information into a jwt.
     * @param user The user to encode.
     * @param extras The extra information to encode. Is included in the jwt.
     * @returns A promise resolving to the generated token.
     */
    async function encode(user: AuthenticatableUser, extras: {}) {
        const payload = Object.assign({user}, extras);
        const secret = await getSecret();
        const options = {algorithm};

        return jwt.sign(payload, secret, options);
    }

    /**
     * Decodes the provided token using the secret.
     * @param token The token to verify.
     * @returns A promise resolving to the decoded token contents.
     */
    async function verify(token: string) {
        const secret = await getSecret();
        const options = {algorithms: [algorithm]};

        return jwt.verify(token, secret, options);
    }

    return {encode, verify};
}