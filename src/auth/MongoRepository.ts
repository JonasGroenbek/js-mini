import AuthenticatableUser from "./AuthenticatableUser";
import {DuplicateUserIdentifier, Repository} from "./authentication";
import {Model, Document} from "mongoose";

export type UserFactory = (input: {}) => {};
export const defaultUserFactory: UserFactory = e => e;

export default class MongoRepository<T extends AuthenticatableUser & Document> implements Repository<T> {

    /**
     * The user module to retrieve from.
     */
    private readonly userModel: Model<T>;
    private readonly identifierKey: string;
    private readonly passwordKey: string;
    private readonly userFactory: UserFactory;

    /**
     * Creates a new MongoRepository.
     * @param userModel The module to retrieve users from.
     * @param identifierKey The name of the key on the model, the contains the identifier.
     * @param passwordKey The name of the key on the model, that contains the password.
     * @param userFactory Callback that can affect the user before creation.
     */
    constructor(userModel: Model<T>, identifierKey: string = "email", passwordKey: string = "password", userFactory = defaultUserFactory) {
        this.userModel = userModel;
        this.identifierKey = identifierKey;
        this.passwordKey = passwordKey;
        this.userFactory = userFactory;
    }

    async getByIdentifier(identifier: string): Promise<T> {
        return this.userModel.findOne({[this.identifierKey]: identifier}).exec();
    }

    async create(identifier: string, password: string): Promise<T> {
        const found = await this.getByIdentifier(identifier);
        if (found)
            throw new DuplicateUserIdentifier(identifier);

        const factoryResult = this.userFactory({[this.identifierKey]: identifier, [this.passwordKey]: password});
        return this.userModel.create(factoryResult);
    }
}