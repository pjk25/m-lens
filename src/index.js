import m from 'mori';
import { flatten } from './pull';
import { overlay } from './overlay';

function size(a) {
    if (a) {
        return a.length;
    }
    return 0;
}

function makeLens(g, u) {
    return function(other) {
        if (other) {
            return {
                g: function(data) {
                    return g(other.g(data));
                },
                u: function(data, f) {
                    return other.u(data, function(d) {
                        return u(d, f);
                    });
                }
            }
        }

        return {
            g: g,
            u: u
        }
    }
}

export function at(path) {
    function g(data) {
        return m.getIn(data, path);
    }

    function u(data, f) {
        return m.updateIn(data, path, f);
    }

    return makeLens(g, u);
}

export function pull(tree) {
    function g(data) {
        return m.reduce(function(acc, path) {
            return m.assocIn(acc, path, m.getIn(data, path));
        }, m.hashMap(), flatten(m.vector(), tree));
    }

    function u(data, f) {
        let updated = f(g(data));
        return m.reduce(function(acc, path) {
            let paths = m.map(m.subvec, m.repeat(path), m.repeat(0), m.range(m.count(path), 0, -1));

            let r = m.some(m.identity, m.map(function(path) {
                let e = m.getIn(updated, path);
                if (e) {
                    return {
                        path: path,
                        value: e
                    }
                }
            }, paths));

            if (r) {
                return m.assocIn(acc, r.path, r.value);
            }
            return acc;
        }, data, flatten(m.vector(), tree));
    }

    return makeLens(g, u);
}

export function as(from, to) {
    function g(data) {
        return m.assocIn(m.hashMap(), to, m.getIn(data, from));
    }

    function u(data, f) {
        let updated = f(g(data));
        return m.assocIn(data, from, m.getIn(updated, to));
    }

    return makeLens(g, u);
}

export function view(data, lens) {
    return lens().g(data);
}

export function update(data, lens, f) {
    return lens().u(data, f);
}

function joinTwo(lhs, rhs) {
    function g(data) {
        return overlay(lhs().g(data), rhs().g(data));
    }

    function u(data, f) {
        let updated = f(g(data));
        return lhs().u(rhs().u(data, m.constantly(updated)), m.constantly(updated));
    }

    return makeLens(g, u);
}

export function join(...lenses) {
    let [x, ...xs] = lenses;
    if (size(xs) > 1) {
        return joinTwo(x, join(...xs));
    } else if (size(xs) > 0) {
        return joinTwo(x, xs[0]);
    } else {
        return x;
    }
}
