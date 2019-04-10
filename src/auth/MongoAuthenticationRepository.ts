import AuthenticatableUser from "./AuthenticatableUser";
import {DuplicateUserIdentifier, AuthenticationRepository} from "./authentication";
import {Model, Document} from "mongoose";

export type UserFactory = (input: {}) => {};
export const defaultUserFactory: UserFactory = e => e;

export default class MongoAuthenticationRepository<T extends AuthenticatableUser & Document>
    implements AuthenticationRepository<T> {

    /**
     * The user module to retrieve from.
     */
    private readonly userModel: Model<T>;
    private readonly identifierKey: string;
    private readonly passwordKey: string;
    private readonly userFactory: UserFactory;

    /**
     * Creates a new MongoAuthenticationRepository.
     * @param userModel The module to retrieve users from.
     * @param identifierKey The name of the key on the model, the contains the identifier.
     * @param passwordKey The name of the key on the model, that contains the password.
     * @param userFactory A callback that can affect the user object before creation.
     */
    constructor(userModel: Model<T>, identifierKey: string = "email", passwordKey: string = "password", userFactory = defaultUserFactory) {
        this.userModel = userModel;
        this.identifierKey = identifierKey;
        this.passwordKey = passwordKey;
        this.userFactory = userFactory;
    }

    /**
     * Finds the user with the provided identifier.
     * @param identifier The identifier.
     */
    async getByIdentifier(identifier: string): Promise<T> {
        return this.userModel.findOne({[this.identifierKey]: identifier}).exec();
    }

    /**
     * Creates a new user using the provided identifier and password.
     * @param user The user to persist.
     */
    async create(user: T): Promise<T> {
        const identifier = user.authenticationIdentifier();
        const found = await this.getByIdentifier(identifier);
        if (found)
            return Promise.reject(new DuplicateUserIdentifier(identifier));

        const factoryResult = this.userFactory(user);
        return this.userModel.create(factoryResult);
    }
}