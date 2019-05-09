export default interface AuthenticatableUser {

    authenticationIdentifier(): string;

    authenticationPassword(): string;

    setAuthenticationPassword(newValue: string): any;
}

export function createAuthenticatableUser(userObject: any, identifierKey: string, passwordKey: string) {

    userObject.authenticationIdentifier = function (): string {
        return this[identifierKey];
    }.bind(userObject);

    userObject.authenticationPassword = function (): string {
        return this[passwordKey];
    }.bind(userObject);

    userObject.setAuthenticationPassword = function (newValue: string): any {
        this[passwordKey] = newValue;
    }.bind(userObject);

    return userObject;
}