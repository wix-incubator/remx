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
const semver = require('semver');

function execSync(cmd) {
  cp.execSync(cmd, {stdio: [0, 1, 2]});
}

function execSyncRead(cmd) {
  cp.execSync(cmd);
}

function execSyncSilently(cmd) {
  cp.execSync(cmd, {stdio: ['ignore', 'ignore', 'ignore']});
}

execSync(`git config --global push.default simple`);
execSyncSilently(`git config --global user.email "zlotindaniel@gmail.com"`);
execSyncSilently(`git config --global user.name "DanielZlotin"`);
execSyncSilently(`git remote add deploy "https://DanielZlotin:${process.env.GIT_TOKEN}@github.com/wix/remx.git"`);

execSync(`git checkout master`);
execSync(`git reset --hard`);

//const currentVersion = JSON.parse(String(execSyncRead(`npm view remx version -j`)));
//const newVersion;

const npmrcPath = p.resolve(`${__dirname}/.npmrc`);
execSync(`cp -rf ${npmrcPath} .`);

execSync(`npm version ${newVersion}`);
execSyncSilently(`git push deploy`);
execSync(`npm publish`);
