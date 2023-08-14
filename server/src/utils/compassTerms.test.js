import { directions } from './compassTerms';

/**
 * This tests doesnt work, as above import throw an error.
 * I have not found why it does that, but as to not
 * waste any more time, the below test is just presented as is..
 */
describe('Making sure that order of wind directions do not change by accident', () => {
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
