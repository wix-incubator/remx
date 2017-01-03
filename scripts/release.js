if (!process.env.CI || !process.env.TRAVIS) {
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

function execSync(cmd) {
  cp.execSync(cmd, {stdio: [0, 1, 2]});
}

execSync(`git config --global push.default simple`);
execSync(`git config --global user.email "zlotindaniel@gmail.com"`);
execSync(`git config --global user.name "DanielZlotin"`);

execSync(`git remote add deploy "https://DanielZlotin:${process.env.GIT_TOKEN}@github.com/wix/remx.git"`);

execSync(`git status`);
execSync(`git checkout master`);
execSync(`git reset --hard`);

const npmrcPath = p.resolve(`${__dirname}/.npmrc`);
execSync(`cp -rf ${npmrcPath} .`);
execSync(`npm version patch && git push deploy && npm publish`);
