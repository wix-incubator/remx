import proxyquireLib from 'proxyquire';

describe('environment', () => {
  it('babel destructuring', () => {
    const {inner} = {inner: 'hello'};
    expect(inner).toEqual('hello');
  });

  it('babel spread', () => {
    const {x, ...y} = {x: 1, a: 2, b: 3};
    expect(x).toEqual(1);
    expect(y).toEqual({a: 2, b: 3});
  });

  it('babel async await', async(done) => {
    const result = await getResultAsync();
    expect(result).toEqual('hello');
    done();
  });

  function getResultAsync() {
    return new Promise((r) => r('hello'));
  }

  it('proxyquire', () => {
    const mock = {};
    const demoModule = proxyquireLib.noCallThru().noPreserveCache()('./demoModule', {
      'must-be-mocked': mock
    });
    expect(demoModule).toBe(mock);
  });
});
