import {Schema, Document, model} from "mongoose";
import AuthenticatableUser from "../auth/AuthenticatableUser";

export const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, unique: true, required: true},
}, {strict: false});

UserSchema.methods.authenticationIdentifier = function () {
    return this.email;
};

UserSchema.methods.authenticationPassword = function () {
    return this.password;
};

export interface User extends Document, AuthenticatableUser {
    email: string;
    password: string;
}

export default model<User>("User", UserSchema);