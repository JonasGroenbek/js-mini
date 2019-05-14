import {Request} from "express";
import {jsonWebTokenService} from "../../util/configuration";
import {createAuthenticatableUser} from "../../auth/AuthenticatableUser";
import {User} from "../../data/User";

export default async function authentication(request: Request): Promise<User> {

    const authorizationHeader = request.headers["authorization"];

    if (!authorizationHeader)
        throw new Error("You must be authenticated to access this endpoint.");

    if (!authorizationHeader.startsWith("Bearer "))
        throw new Error("The provided authentication token must be prepended with 'Bearer '.");

    try {
        const contents = await jsonWebTokenService.verify(authorizationHeader.slice(7));
        // @ts-ignore
        return createAuthenticatableUser(contents.user);
    } catch (e) {
        throw new Error("The provided authentication token is invalid or has expired.");
    }
}