import AuthenticationProvider from "../auth/authentication";
import {createRestConfiguration} from "../auth/router";
import MongoRepository from "../auth/MongoRepository";
import UserModel from "../data/User";
import {getSecretFromConfig, JwtConfiguration} from "../auth/jwt";

export const jwtConfiguration: JwtConfiguration = {
    algorithm: "HS256",
    getSecret: getSecretFromConfig("JWT_SECRET")
};

export const authenticationStorage = new MongoRepository(UserModel);
export const authenticationProvider = new AuthenticationProvider(authenticationStorage);
export const restAuthentication = createRestConfiguration({
    authenticationProvider,
    jwtConfiguration
});