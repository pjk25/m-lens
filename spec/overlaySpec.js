import m from 'mori';
import { overlay } from '../src/overlay';

describe('overlay', function() {
    beforeEach(function() {
        this.first = m.toClj({
            a: [1, 2, 3],
            b: {
                c: 1,
                d: 2
            }
        });

        this.second = m.toClj({
            b: {
                c: [4, 5, 6]
            },
            e: [7, 8, 9]
        });
    })

    it('deeply merges maps', function() {
        expect(m.toJs(overlay(this.first, this.second))).toEqual({
            a: [1, 2, 3],
            b: {
                c: [4, 5, 6],
                d: 2
            },
            e: [7, 8, 9]
        });
    });
});