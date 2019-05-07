import UserModel from "../../../data/User";

export async function getUsers() {
    return await UserModel.find().exec();
}

export async function getUser(args: { id: string }) {
    return await UserModel.findById(args.id).exec();
}