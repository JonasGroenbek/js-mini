import {SafeString} from "handlebars";
import {Converter} from "showdown";
import {LoggerInstance} from "winston";
import {errorToObject} from "../errors/error";

export type Position = {
    longitude: number;
    latitude: number
};

export function positionGoogleMapsLink(position: Position) {
    const {longitude, latitude} = position;
    const href = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    return new SafeString(`<a target="_blank" href="${href}">${latitude} ${longitude}</a>`);
}

const converter = new Converter();

export function markdownRenderer(markdown: string) {
    return new SafeString(
        converter.makeHtml(markdown)
    );
}

// https://axiacore.com/blog/check-if-item-array-handlebars-547/
// @ts-ignore
export function ifIn(elem, list, options) {
    if (options.hash.path) {
        for (const e of list)
            if (e[options.hash.path] == elem)
                return options.fn(this);

        return options.inverse(this);
    } else {
        if (list.indexOf(elem) > -1)
            return options.fn(this);
        else
            return options.inverse(this);
    }
}

export function handlebarsHelperLogger(f: Function, logger: LoggerInstance) {
    return () => {
        try {
            f();
        } catch (e) {
            logger.error(`Error in handlebars helper ${functionName(f)}: ${e.message}`);
        }
    };
}

// https://stackoverflow.com/a/15714445
function functionName(fun: Function) {
    let ret = fun.toString();
    ret = ret.substr("function ".length);
    ret = ret.substr(0, ret.indexOf("("));
    return ret;
}