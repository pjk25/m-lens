import m from "mori";
import {view, update, at} from "../src/index.js"

describe('m-lens', function() {
    describe('at', function() {
        it('returns a lens that focuses on a property of a structure', function() {
            let data = m.toClj({
                vector: [1, 2, 3],
                map: {
                    one: 1,
                    two: 2
                }
            });

            let lens = at('vector');

            expect(m.toJs(view(data, lens)))
                .toEqual([1, 2, 3]);

            expect(m.toJs(update(data, lens, m.last)))
                .toEqual({
                    vector: 3,
                    map: {
                        one: 1,
                        two: 2
                    }
                })
        });
    });
});
