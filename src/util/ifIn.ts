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
