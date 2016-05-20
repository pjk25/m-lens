import m from 'mori';
import * as lenses from 'm-lens';

let data = m.hashMap(
    'nested', m.hashMap(
        'a', 1,
        'b', 2,
        'c', 3),
    'vector', m.vector(4, 5, 6));

let lens = m.comp(lenses.pull(m.vector('a', 'b')), lenses.at(m.vector('nested')));

console.log(lenses.view(data, lens));

console.log(lenses.update(data, lens, function (d) {
    return m.assoc(d, 'a', 10);
}));
