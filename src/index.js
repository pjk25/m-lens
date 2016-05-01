import m from "mori";

export function at(key) {
    return function() {
        return key;
    }
}

export function view(data, lens) {
    return m.get(data, lens());
}

export function update(data, lens, f) {
    return m.assoc(data, lens(), f(view(data, lens)));
}
