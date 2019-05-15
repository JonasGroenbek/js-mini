import {SafeString} from "handlebars";

type Position = {
    longitude: number;
    latitude: number
};

export function handlebarsPositionHelper(position: Position) {
    const {longitude, latitude} = position;
    const href = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    return new SafeString(`<a target="_blank" href="${href}">${latitude} ${longitude}</a>`);
}