import UserFacade from "../../facades/UserFacade";
import {GraphQueryGetUserByIdArgs} from "../../facades/graphql";

export async function getUsers() {
    return UserFacade.getUsers();
}

export async function getUserById(args: GraphQueryGetUserByIdArgs) {
    return UserFacade.getUserById(args.identifier);
}