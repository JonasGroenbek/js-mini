export default interface AuthenticateableUser {
    authenticationIdentifierKey(): string;
    authenticationIdentifier(): string;
    authenticationPassword(): string;
}