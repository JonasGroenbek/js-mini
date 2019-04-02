import express, {Request, Response} from "express";

export type RestConfiguration = {
    registrationUrl?: string,
    authenticationUrl?: string,
};

function restAuthentication(req: Request, res: Response, next: (err: Error) => void) {

}

function restRegistration(req: Request, res: Response, next: (err: Error) => void) {

}

export function rest(configuration: RestConfiguration) {
    const defaults = {registrationUrl: "registration", authenticationUrl: "authentication"};
    configuration = Object.assign(defaults, configuration);
    const router = express.Router();

    router.post(configuration.authenticationUrl, restAuthentication);
    router.post(configuration.registrationUrl, restRegistration);

    return router;
}