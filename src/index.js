import m from 'mori';
import { flatten } from './pull';

export function at(path) {
    return function(other) {
        function g(data) {
            return m.getIn(data, path);
        }

        function u(data, f) {
            return m.updateIn(data, path, f);
        }

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

export function pull(tree) {
    return function(other) {
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

export function view(data, lens) {
    return lens().g(data);
}

export function update(data, lens, f) {
    return lens().u(data, f);
}
