import m from 'mori';

//todo: make 1st arg optional
export function flatten(parent, tree) {
    return m.reduce(function(acc, val) {
        if (m.isMap(val)) {
            return m.reduceKV(function(acc, key, val) {
                let f = flatten(m.conj(parent, key), val);
                return m.reduce(m.conj, acc, f);
            }, acc, val);
        }
        return m.conj(acc, m.conj(parent, val));
    }, m.vector(), tree);
}
