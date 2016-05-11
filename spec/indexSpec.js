import m from "mori";
import { view, update, at, pull, as } from "../src/index.js"

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
            let lens = at(m.vector('vector'));

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
        });

        it('returns a lens that focuses on a path of a structure', function() {
            let lens = at(m.vector('map', 'nested'));

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

    describe('pull', function() {
        it('focuses on a portion of the structure', function() {
            let lens = pull(m.toClj([{'map': ['vector', 'nested']}]));

            expect(m.toJs(view(data, lens)))
                .toEqual({
                    map: {
                        vector: [4, 5, 6],
                        nested: {
                            one: 1,
                            two: 2
                        }
                    }
                });

            expect(m.toJs(update(data, lens, m.curry(m.assocIn, m.vector('map', 'nested', 'one'), 2))))
                .toEqual({
                    map: {
                        vector: [4, 5, 6],
                        nested: {
                            one: 2,
                            two: 2
                        }
                    },
                    vector: [1, 2, 3]
                });
        });
    });

    describe('as', function() {
        it('renames a path in the structure', function() {
            let lens = as(m.vector('map', 'vector'), m.vector('array'));

            expect(m.toJs(view(data, lens)))
                .toEqual({
                    array: [4, 5, 6]
                });

            expect(m.toJs(update(data, lens, function(d) {
                return m.updateIn(d, ['array', 1], m.inc)
            })))
                .toEqual({
                    map: {
                        vector: [4, 6, 6],
                        nested: {
                            one: 1,
                            two: 2
                        }
                    },
                    vector: [1, 2, 3]
                });
        });
    });

    describe('composing lenses', function() {
        it('function composition stacks the lenses', function() {
            let lens = m.comp(at(m.vector('nested')), at(m.vector('map')));

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

        it('function composition stacks heterogenous lenses', function() {
            let lens = m.comp(
                pull(m.toClj([{'nested': ['one']}])),
                at(m.vector('map'))
            );

            expect(m.toJs(view(data, lens)))
                .toEqual({
                    nested: {
                        one: 1
                    }
                });

            expect(m.toJs(update(data, lens, m.curry(m.assocIn, m.vector('nested', 'one'), 3))))
                .toEqual({
                    map: {
                        vector: [4, 5, 6],
                        nested: {
                            one: 3,
                            two: 2
                        }
                    },
                    vector: [1, 2, 3]
                });
        });

        it('function composition can change types', function() {
            let lens = m.comp(
                pull(m.toClj([{'nested': ['one']}])),
                at(m.vector('map'))
            );

            expect(m.toJs(update(data, lens,  m.curry(m.assoc, 'nested', 3))))
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
