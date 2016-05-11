import m from 'mori';

export function overlay(first, second) {
    if (m.isAssociative(first) && m.isAssociative(second)) {
        return m.reduceKV(function(acc, key, val) {
            let v = val;
            if (m.isAssociative(val)) {
                v = overlay(m.get(first, key), val);
            }
            return m.assoc(acc, key, v);
        }, first, second);
    }
    return second;
}