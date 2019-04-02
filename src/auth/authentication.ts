import bcrypt from "bcrypt";
import AuthenticatableUser from "./AuthenticatableUser";
import {ApplicationError} from "../errors/error";

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

export default function create<T extends AuthenticatableUser>(repository: Repository<T>) {

    /**
     * Attempts to authenticate the user with the provided email and password.
     * @param identifier The email to use to authenticate
     * @param password The password to use to authenticate.
     * @returns The found user when authentication succeeds, <code>null</code> when it fails.
     */
    async function authenticate(identifier: string, password: string) {

        const found = await repository.getByIdentifier(identifier);
        const verified = await bcrypt.compare(found.authenticationPassword(), password);
        return verified ? found : undefined;
    }

    /**
     * Registers a new user account using the provided credentials.
     * @param identifier The identifier to register the account with.
     * @param password The password of the account to create.
     * @returns The newly created user when the registration succeeds, <code>null</code> when it fails.
     */
    async function register(identifier: string, password: string): Promise<T> {

        const found = await repository.getByIdentifier(identifier);
        if (found)
            throw new DuplicateUserIdentifier(identifier);

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = await repository.create(identifier, password);

        return user;
    }

    return {authenticate, register};
}

export class DuplicateUserIdentifier extends ApplicationError {

    constructor(identifier: string) {
        super(`Duplicate identifier for user ${identifier}.`, 402, undefined);
    }
}