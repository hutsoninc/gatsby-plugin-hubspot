export const oneline = (...args) => {
    let out = '';
    for (let i = 0; i < args.length; i++) {
        if (Array.isArray(args[i])) {
            out += args[i].join('');
        } else {
            out += args[i];
        }
    }
    return out.replace(/\s\s+/g, '');
};

export const isDefined = val => {
    return typeof val !== 'undefined' && val !== null;
};
