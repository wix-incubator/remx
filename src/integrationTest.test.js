describe('integration test for using remx', () => {
  it('should use es6 remx if Proxy available', () => {
    global.Proxy = {};
    const remx = require('./index');
    expect(remx.__versionType).toBe('es6');
    expect(remx.action).toBeDefined();
    expect(remx.runInAction).toBeDefined();
    expect(remx.Provider).toBeDefined();
    expect(remx.inject).toBeDefined();
  });

  it('should use legacy remx if Proxy is not available', () => {
    global.Proxy = undefined;
    const remx = require('./index');
    expect(remx.__versionType).toBe('legacy');
    expect(remx.action).toBeDefined();
    expect(remx.runInAction).toBeDefined();
    expect(remx.Provider).toBeDefined();
    expect(remx.inject).toBeDefined();
  });
});
