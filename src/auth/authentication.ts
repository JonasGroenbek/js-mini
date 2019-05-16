import bcrypt from "bcrypt";
import AuthenticatableUser from "./AuthenticatableUser";
import {ApplicationError} from "../errors/error";
import {StackFrame} from "stack-trace";

export interface AuthenticationRepository<T extends AuthenticatableUser> {

    /**
     * Returns the authenticatable user with the provided identifier.
     * @param identifier The identifier of the user to retrieve.
     */
    getByIdentifier(identifier: string): Promise<T>;

    /**
     * Creates and returns a new repository.
     * @param user The user to persist.
     */
    create(user: T): Promise<T>;
}

export interface AuthenticationProvider<T extends AuthenticatableUser> {

    /**
     * Attempts to authenticate the user with the provided email and password.
     * @param identifier The email to use to authenticate
     * @param password The password to use to authenticate.
     * @returns The found user when authentication succeeds, <code>null</code> when it fails.
     */
    authenticate(identifier: string, password: string): Promise<T>;

    /**
     * Registers a new user account using the provided credentials.
     * @param user The user to register.
     * @returns The newly created user when the registration succeeds, <code>null</code> when it fails.
     */
    register(user: T): Promise<T>;
}

export default class BcryptAuthenticationProvider<T extends AuthenticatableUser> implements AuthenticationProvider<T> {

    /**
     * The repository to store user information within.
     */
    private repository: AuthenticationRepository<T>;

    /**
     * Creates a new AuthenticationProvider
     * @param repository The repository to store user information within.
     */
    constructor(repository: AuthenticationRepository<T>) {
        this.repository = repository;
    }

    /**
     * Attempts to authenticate the user with the provided email and password.
     * @param identifier The email to use to authenticate
     * @param password The password to use to authenticate. The password is hashed using the Bcrypt hashing function.
     * @returns The found user when authentication succeeds, <code>null</code> when it fails.
     */
    async authenticate(identifier: string, password: string): Promise<T> {

        return new Promise(async (resolve, reject) => {

            const error = new IncorrectCredentialsError();
            const found = await this.repository.getByIdentifier(identifier);
            if (found == undefined) {
                reject(error);
                return;
            }

            const verified = await bcrypt.compare(password, found.authenticationPassword());
            if (!verified) {
                reject(error);
                return;
            }

            resolve(found);
        });
    }

    /**
     * Registers a new user account using the provided credentials.
     * @param user The user to register.
     * @returns The newly created user when the registration succeeds, <code>null</code> when it fails.
     */
    async register(user: T): Promise<T> {

        return new Promise(async (resolve, reject) => {

            const found = await this.repository.getByIdentifier(user.authenticationIdentifier());
            if (found != undefined) {
                reject(new DuplicateUserIdentifier(user.authenticationIdentifier()));
                return;
            }

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(user.authenticationPassword(), salt);
            user.setAuthenticationPassword(hash);
            const created = await this.repository.create(user);

            resolve(created);
        });
    }
}

/**
 * The most general exception thrown on authentication errors.
 */
export class AuthenticationError extends ApplicationError {

    constructor(name: string,
                message: string,
                status: number,
                cause: Error | ApplicationError,
                stack: StackFrame[]) {
        super(name, message, status, cause, stack);
    }
}

/**
 * Thrown when two users has the same identifier, when creating a new user account.
 */
export class DuplicateUserIdentifier extends ApplicationError {

    constructor(identifier: string) {
        super("DuplicateUserIdentifier", `Duplicate identifier ${identifier}.`, 402, undefined, undefined);
    }
}

export class IncorrectCredentialsError extends AuthenticationError {
    constructor() {
        super("IncorrectCredentialsError", "Could not authenticate using the provided credentials.", 401, undefined, undefined);
    }
}