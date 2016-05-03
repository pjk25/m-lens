import m from "mori";
import { view, update, at } from "../src/index.js"

describe('m-lens', function() {
    let data;

    beforeEach(function() {
        data = m.toClj({
            map: {
                vector: [4, 5, 6],
                nested: {
                    one: 1,
                    two: 2
                }
            },
            vector: [1, 2, 3],
        });
    });

    describe('at', function() {
        it('returns a lens that focuses on a property of a structure', function() {
            let lens = at(['vector']);

            expect(m.toJs(view(data, lens)))
                .toEqual([1, 2, 3]);

            expect(m.toJs(update(data, lens, m.last)))
                .toEqual({
                    map: {
                        vector: [4, 5, 6],
                        nested: {
                            one: 1,
                            two: 2
                        }
                    },
                    vector: 3
                });

            lens = at(['map', 'nested']);

            expect(m.toJs(view(data, lens)))
                .toEqual({
                    one: 1,
                    two: 2
                });

            expect(m.toJs(update(data, lens, m.constantly(3))))
                .toEqual({
                    map: {
                        vector: [4, 5, 6],
                        nested: 3
                    },
                    vector: [1, 2, 3]
                });
        });
    });

    describe('composing lenses', function() {
        it('function composition stacks the lenses', function() {
            let lens = m.comp(at(['nested']), at(['map']));

            expect(m.toJs(view(data, lens)))
                .toEqual({
                    one: 1,
                    two: 2
                });

            expect(m.toJs(update(data, lens, m.constantly(3))))
                .toEqual({
                    map: {
                        vector: [4, 5, 6],
                        nested: 3
                    },
                    vector: [1, 2, 3]
                });
        });
    });
});
