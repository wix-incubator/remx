if (!process.env.CI) {
  throw new Error(`releasing is only available from Travis CI`);
}

if (process.env.TRAVIS_BRANCH !== 'master') {
  console.error(`not publishing on branch ${process.env.TRAVIS_BRANCH}`);
  return;
}

if (process.env.TRAVIS_PULL_REQUEST !== 'false') {
  console.error(`not publishing as triggered by pull request ${process.env.TRAVIS_PULL_REQUEST}`);
  return;
}

const cp = require('child_process');
const p = require('path');

cp.execSync(`git config --global user.email "zlotindaniel@gmail.com"`);
cp.execSync(`git config --global user.name "Daniel Zlotin"`);

const npmrcPath = p.resolve(`${__dirname}/npmrc`);
cp.execSync(`npm config set userconfig "${npmrcPath}" && npm version patch && npm publish && git push`, {stdio: [0, 1, 2]});
