import m from "mori";

export function at(path) {
    return [[path, []]];
}

export function view(data, lens) {
    return m.reduce(function(acc, [from, to]) {
        const value = m.getIn(data, from);
        if (to.length) {
            return m.assocIn(acc, to, value);
        } else if (m.isVector(value)) {
            return value;
        } else {
            return m.merge(acc, value);
        }
    }, m.hashMap(), lens);
}

export function update(data, lens, f) {
    const value = f(view(data, lens));
    return m.reduce(function(acc, [from, to]) {
        if (to.length) {
            return m.assocIn(data, from, m.getIn(value, to));
        } else {
            return m.assocIn(data, from, value);
        }
    }, data, lens)
}
