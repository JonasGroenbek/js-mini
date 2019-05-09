import {Schema, Document, model} from "mongoose";
import AuthenticatableUser from "../auth/AuthenticatableUser";
import {ValidationSchema} from "fastest-validator";

export const UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
}, {strict: true});

export const UserValidationSchema: ValidationSchema = {
    firstName: {type: "string", max: 256, required: true},
    lastName: {type: "string", max: 256, required: true},
    email: {type: "email", max: 256},
    password: {type: "string", min: 6}
};

UserSchema.methods.authenticationIdentifier = function () {
    return this.email;
};

UserSchema.methods.authenticationPassword = function () {
    return this.password;
};

export interface User extends Document, AuthenticatableUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export default model<User>("User", UserSchema);