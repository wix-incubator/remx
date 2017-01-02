if (!process.env.CI) {
  throw new Error(`releasing is only available from Travis CI`);
}

if (process.env.TRAVIS_BRANCH !== 'master') {
  console.log(`not publishing on branch ${process.env.TRAVIS_BRANCH}`);
  return;
}

if (process.env.TRAVIS_PULL_REQUEST) {
  console.log(`not publishing as triggered by ${process.env.TRAVIS_PULL_REQUEST}`);
  return;
}

const cp = require('child_process');
console.log(String(cp.execSync(`npm userconfig ./npmrc && npm version patch && npm publish && git push`)));
