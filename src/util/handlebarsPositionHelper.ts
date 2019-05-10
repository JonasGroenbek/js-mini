import {SafeString} from "handlebars";

export function handlebarsPositionHelper(position: number[]) {
    const longitude = position[0];
    const latitude = position[1];
    const href = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    return new SafeString(`<a target="_blank" href="${href}">${latitude} ${longitude}</a>`
    );
}