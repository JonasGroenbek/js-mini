import UserModel, {User} from "../../../data/User";
import {GraphQueryGetUserByIdArgs, GraphUser} from "../../../generated/graphql";
import {Request} from "express";

export function converter(model: User): GraphUser {

    if (!model)
        return undefined;

    return {
        ...model,
        identifier: model._id,
    };
}

export async function getUsers(input: {}, request: Request): Promise<GraphUser[]> {

    return (await UserModel.find({}).lean().exec()).map(converter);
}

export async function getUserById(args: GraphQueryGetUserByIdArgs): Promise<GraphUser> {
    return converter(await UserModel.findById(args.identifier).lean().exec());
}