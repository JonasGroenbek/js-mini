import {Request} from "express";
import {SafeString} from "handlebars";

export enum Severity {
    INFO = "info",
    WARNING = "warning",
    ERROR = "error",
    SUCCESS = "success"
}

export interface Message {
    readonly text: string;
    readonly severity: Severity;
}

export interface MessengerOptions {
    displayLength?: number;
    inDuration?: number;
    outDuration?: number;
    classes?: string;
    sessionKey?: string;
}

export interface Messenger {

    pushMessage(message: string, severity: Severity): void;

    pushInfo(message: string): void;

    pushWarning(message: string): void;

    pushError(message: string): void;

    pushSuccess(message: string): void;

    getMessages(): Message[];

    hasMessages(): boolean;

    countMessages(): number;

    clear(): void;

    getOptions(): MessengerOptions;
}

type Root = {
    options: MessengerOptions,
    messages: Message[]
};

export class SessionMessenger implements Messenger {

    private readonly req: Request;
    private readonly options: MessengerOptions;
    private readonly root: Root;

    constructor(req: Request, options: MessengerOptions) {

        this.req = req;
        this.options = options;

        if (!req.session)
            throw new Error("Must have session to send messages.");

        if (!req.session[options.sessionKey]) {
            req.session[options.sessionKey] = {
                options: options,
                messages: []
            };
        }

        this.root = req.session[options.sessionKey];
    }

    clear(): void {
        while (this.root.messages.length > 0) {
            this.root.messages.pop();
        }
    }

    countMessages(): number {
        return this.root.messages.length;
    }

    hasMessages(): boolean {
        return this.countMessages() > 0;
    }

    getMessages(): Message[] {
        return [...this.root.messages];
    }

    pushMessage(message: string, severity: Severity): void {
        this.root.messages.push({text: message, severity});
    }

    pushError(message: string): void {
        this.pushMessage(message, Severity.ERROR);
    }

    pushInfo(message: string): void {
        this.pushMessage(message, Severity.INFO);
    }

    pushSuccess(message: string): void {
        this.pushMessage(message, Severity.SUCCESS);
    }

    pushWarning(message: string): void {
        this.pushMessage(message, Severity.WARNING);
    }

    getOptions() {
        return this.options;
    }
}

const defaults = {
    displayLength: 5000,
    inDuration: 300,
    outDuration: 375,
    classes: "message ",
    sessionKey: "messenger.ts",
};

export function sessionMessenger(req: Request, options: MessengerOptions = {}) {
    return new SessionMessenger(req, Object.assign(defaults, options));
}

export function messengerRenderer(messenger: Messenger) {

    if (!messenger || !messenger.hasMessages())
        return new SafeString("");

    const render = function (message: Message) {
        const options = Object.assign(messenger.getOptions(), {html: message.text});
        options.classes += message.severity;
        return `M.toast(${JSON.stringify(options)})`;
    };

    const result = new SafeString(`<script>
          ${messenger.getMessages().map(render).join("\n")}
        </script>`);

    messenger.clear();

    return result;
}