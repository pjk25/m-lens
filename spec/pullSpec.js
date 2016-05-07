import m from 'mori';
import {flatten} from '../src/pull';

describe('pull', function() {
    describe('flatten', function() {
        it('flattens pull syntax vectors', function() {
            expect(m.toJs(flatten(m.vector(), m.vector('a', 'b', 'c'))))
                .toEqual([
                    ['a'],
                    ['b'],
                    ['c']
                ]);
        });

        it('flattens pull syntax with nesting', function() {
            expect(m.toJs(flatten(m.vector(), m.toClj([{'a': [{'b': ['c']}]}]))))
                .toEqual([
                    ['a', 'b', 'c']
                ]);
        });

        it('flattens pull syntax trees', function() {
            expect(m.toJs(flatten(m.vector(), m.toClj(['a', 'b', {'c': [{'d': ['e']}, 'f']}]))))
                .toEqual([
                    ['a'],
                    ['b'],
                    ['c', 'd', 'e'],
                    ['c', 'f']
                ]);
        });
    });
});