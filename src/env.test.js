const fs = require('fs');

describe('environment', () => {
  it('package lock from npmpublic', () => {
    const lockFile = JSON.parse(fs.readFileSync(`${__dirname}/../package-lock.json`));
    expect(lockFile.dependencies.lodash.resolved).toMatch(/^https:\/\/registry.npmjs.org.*/);
  });
});
