import {flatten} from '../src/pull';

describe('pull', function() {
    describe('flatten', function() {
        it('flattens pull syntax', function() {
            expect(flatten([], ['a', 'b', 'c']))
                .toEqual([
                    ['a'],
                    ['b'],
                    ['c']
                ]);
        });

        it('flattens pull syntax with nesting', function() {
            expect(flatten([], ['a', 'b', {'c': ['d', 'e']}]))
                .toEqual([
                    ['a'],
                    ['b'],
                    ['c', 'd'],
                    ['c', 'e']
                ]);
        });
    });
});