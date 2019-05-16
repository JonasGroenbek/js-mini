import UserModel, {User} from "../../data/User";
import {GraphUser} from "./graphql";

export default class UserFacade {

    static async getUserById(id: string) {
        const user = await UserModel.findById(id).lean().exec();
        return this.convertOne(user);
    }

    static async getUsers() {
        const users = await UserModel.find({}).lean().exec();
        return UserFacade.convertMany(users);
    }

    static async convertOne(user: User): Promise<GraphUser> {
        return !user ? undefined : {
            ...user,
            identifier: user._id,
        };
    }

    static async convertMany(users: User[]): Promise<GraphUser[]> {
        const result = [];
        for (const u of users)
            result.push(await this.convertOne(u));

        return result;
    }
}