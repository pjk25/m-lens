import m from 'mori';
import { flatten } from './pull';

export function at(path) {
    return function(other) {
        if (other) {
            return other.map(function([from, to]) {
                return [from.concat(path), to];
            });
        }
        return [[path, []]];
    };
}

export function pull(tree) {
    return function() {
        return m.toJs(m.map(function (path) {
            return [path, path];
        }, flatten([], tree)));
    }
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
    }, m.hashMap(), lens());
}

export function update(data, lens, f) {
    const value = f(view(data, lens));
    return m.reduce(function(acc, [from, to]) {
        if (to.length) {
            return m.assocIn(data, from, m.getIn(value, to));
        } else {
            return m.assocIn(data, from, value);
        }
    }, data, lens())
}
