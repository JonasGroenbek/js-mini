import bcrypt from "bcrypt";
import AuthenticatableUser from "./AuthenticatableUser";
import {ApplicationError} from "../errors/error";

export class AuthenticationError extends ApplicationError {
    constructor(message: string, cause?: Error) {
        super(message, 401, cause);
    }
}

export interface Repository<T extends AuthenticatableUser> {

    /**
     * Returns the authenticatable user with the provided identifier.
     * @param identifier The identifier of the user to retrieve.
     */
    getByIdentifier(identifier: string): Promise<T>;

    /**
     * Creates and returns a new repository.
     * @param identifier The identifier of the user to create.
     * @param password The password of the user to create.
     */
    create(identifier: string, password: string): Promise<T>;
}

export default class AuthenticationProvider<T extends AuthenticatableUser> {

    private repository: Repository<T>;

    constructor(repository: Repository<T>) {
        this.repository = repository;
    }

    /**
     * Attempts to authenticate the user with the provided email and password.
     * @param identifier The email to use to authenticate
     * @param password The password to use to authenticate.
     * @returns The found user when authentication succeeds, <code>null</code> when it fails.
     */
    async authenticate(identifier: string, password: string) {

        throw new ApplicationError("You bitch", 500, new Error("cause"));

        const error = new AuthenticationError("Could not authenticate user.");
        const found = await this.repository.getByIdentifier(identifier);
        if (found == undefined)
            throw error;

        const verified = await bcrypt.compare(password, found.authenticationPassword());
        if (!verified)
            throw error;
        else
            return found;
    }

    /**
     * Registers a new user account using the provided credentials.
     * @param identifier The identifier to register the account with.
     * @param password The password of the account to create.
     * @returns The newly created user when the registration succeeds, <code>null</code> when it fails.
     */
    async register(identifier: string, password: string): Promise<T> {

        const found = await this.repository.getByIdentifier(identifier);
        if (found != undefined)
            throw new DuplicateUserIdentifier(identifier);

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = await this.repository.create(identifier, hash);

        return user;
    }
}

export class DuplicateUserIdentifier extends ApplicationError {

    constructor(identifier: string) {
        super(`Duplicate identifier for user ${identifier}.`, 402, undefined);
    }
}