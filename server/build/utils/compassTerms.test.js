import { directions } from './compassTerms';
describe('directions array', () => {
    it('is in the correct order', () => {
        const expectedOrder = [
            'North',
            'North-Northeast',
            'Northeast',
            'East-Northeast',
            'East',
            'East-Southeast',
            'Southeast',
            'South-Southeast',
            'South',
            'South-Southwest',
            'Southwest',
            'West-Southwest',
            'West',
            'West-Northwest',
            'Northwest',
            'North-Northwest',
        ];
        expect(directions).toEqual(expectedOrder);
    });
});
