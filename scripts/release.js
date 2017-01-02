if (!process.env.CI) {
  throw new Error(`releasing is only available from Travis CI`);
}

if (process.env.TRAVIS_BRANCH !== 'master' || process.env.TRAVIS_PULL_REQUEST) {
  return;
}

const cp = require('child_process');
cp.execSync(`npm version patch && npm publish && git push`);
