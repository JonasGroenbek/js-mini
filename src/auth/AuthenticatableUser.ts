export default interface AuthenticatableUser {
    authenticationIdentifier(): string;
    authenticationPassword(): string;
}