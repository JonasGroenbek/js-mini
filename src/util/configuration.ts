import AuthenticationProvider from "../auth/authentication";
import UserModel from "../data/User";
import mongooseConnect from "./mongooseConnect";
import DefaultJsonWebTokenService, {getSecretFromConfig, JsonWebTokenServiceOptions} from "../auth/jsonWebToken";
import MongoAuthenticationRepository from "../auth/MongoAuthenticationRepository";
import {createRestAuthenticationOptions} from "../auth/router";

mongooseConnect();

export const jsonWebTokenServiceOptions: JsonWebTokenServiceOptions = {
    algorithm: "HS256",
    getSecret: getSecretFromConfig("JWT_SECRET")
};

export const jsonWebTokenService = new DefaultJsonWebTokenService(jsonWebTokenServiceOptions);
export const authenticationStorage = new MongoAuthenticationRepository(UserModel);
export const authenticationProvider = new AuthenticationProvider(authenticationStorage);
export const restAuthenticationRouterOptions = createRestAuthenticationOptions({
    authenticationProvider,
    jsonWebTokenService
});