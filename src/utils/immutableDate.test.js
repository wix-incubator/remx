import immutableDate from './immutableDate';

describe('immutableDate', () => {
  it('should disallow setters', () => {
    const idate = immutableDate(new Date(1000));
    expect(() => idate.setHours(1)).toThrowError(
      '[remx] attempted to call Date#setHours, modifying dates in store are disallowed, create a new Date instead'
    );
  });

  it('should allow getters', () => {
    const idate = immutableDate(new Date(1000));
    expect(idate.getTime()).toEqual(1000);
  });

  it('should return a new object', () => {
    const date = new Date();
    expect(date).not.toBe(immutableDate(date));
  });
});
