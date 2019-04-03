import AuthenticatableUser from "./AuthenticatableUser";
import jwt from "jsonwebtoken";
import secrets from "../util/secrets";

export interface JsonWebTokenService<T extends AuthenticatableUser> {

    /**
     * Encodes the provided user and extra information into a jwt.
     * @param user The user to encode.
     * @returns A promise resolving to the generated token.
     */
    encode(user: T): Promise<string>;

    /**
     * Decodes the provided token using the secret.
     * @param token The token to verify.
     * @returns A promise resolving to the decoded token contents.
     */
    verify(token: string): Promise<T>;
}

/**
 * The default implementation of the <code>JsonWebTokenService</code> interface.
 */
export default class DefaultJsonWebTokenService<T extends AuthenticatableUser> implements JsonWebTokenService<T> {

    /**
     * The options used by the Json Token Service.
     */
    private options: JsonWebTokenServiceOptions;

    /**
     * Creates a new <code>DefaultJsonWebTokenService</code>
     * @param options The options used by the Json Token Service.
     */
    constructor(options: JsonWebTokenServiceOptions) {
        this.options = options;
    }

    /**
     * Encodes the provided user and extra information into a jwt.
     * @param user The user to encode.
     * @returns A promise resolving to the generated token.
     */
    async encode(user: T): Promise<string> {
        const payload = Object.assign({user});
        const secret = await this.options.getSecret();

        return await jwt.sign(payload, secret, {
            algorithm: this.options.algorithm
        });
    }

    /**
     * Decodes the provided token using the secret.
     * @param token The token to verify.
     * @returns A promise resolving to the decoded token contents.
     */
    async verify(token: string): Promise<T> {
        const secret = await this.options.getSecret();
        const options = {algorithms: [this.options.algorithm]};

        // @ts-ignore
        return jwt.verify(token, secret, options);
    }
}

export type JsonWebTokenServiceOptions = {

    /**
     * The algorithm to use to create jwt.
     */
    algorithm: string,

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
    try {
        return () => Promise.resolve(secrets.getOrThrow(key));
    } catch (e) {
        return () => Promise.reject(e);
    }
}