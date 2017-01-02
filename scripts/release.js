if (!process.env.CI) {
  throw new Error(`releasing is only available from Travis CI`);
}

if (process.env.TRAVIS_BRANCH !== 'master') {
  console.log(`not publishing on branch ${process.env.TRAVIS_BRANCH}`);
  return;
}

if (process.env.TRAVIS_PULL_REQUEST !== 'false') {
  console.log(`not publishing as triggered by ${process.env.TRAVIS_PULL_REQUEST}`);
  return;
}

const cp = require('child_process');
const p = require('path');
const npmrcPath = p.resolve(`${__dirname}/npmrc`);
console.log(String(cp.execSync(`npm userconfig "${npmrcPath}" && npm version patch && npm publish && git push`)));
