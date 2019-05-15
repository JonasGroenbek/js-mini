import UserModel, {User} from "../../data/User";
import {GraphUser} from "./graphql";

export default class UserFacade {

    static async getUserById(id: string) {
        return converter(await UserModel.findById(id).lean().exec());
    }

    static async getUsers() {
        return (await UserModel.find({}).lean().exec()).map(converter);
    }
}

export function converter(model: User): GraphUser {

    if (!model)
        return undefined;

    return {
        ...model,
        identifier: model._id,
    };
}