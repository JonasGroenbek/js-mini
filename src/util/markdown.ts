import {Converter} from "showdown";
import {SafeString} from "handlebars";

const converter = new Converter();

export function handlebarsMarkdown(markdown: string) {
    return new SafeString(
        converter.makeHtml(markdown)
    );
}