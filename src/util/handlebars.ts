import {SafeString} from "handlebars";
import {Converter} from "showdown";

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
export default function ifIn(elem, list, options) {
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