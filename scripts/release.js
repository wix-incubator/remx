const cp = require('child_process');
const p = require('path');
const semver = require('semver');

function execSync(cmd) {
  cp.execSync(cmd, {stdio: ['inherit', 'inherit', 'inherit']});
}

function execSyncRead(cmd) {
  return String(cp.execSync(cmd, {stdio: ['inherit', 'pipe', 'inherit']})).trim();
}

function execSyncSilently(cmd) {
  cp.execSync(cmd, {stdio: ['ignore', 'ignore', 'ignore']});
}

function setupGit() {
  execSync(`git config --global push.default simple`);
  execSyncSilently(`git config --global user.email "zlotindaniel@gmail.com"`);
  execSyncSilently(`git config --global user.name "DanielZlotin"`);
  execSyncSilently(`git remote add deploy "https://DanielZlotin:${process.env.GIT_TOKEN}@github.com/wix/remx.git"`);
  execSync(`git checkout master`);
}

function run() { //eslint-disable-line
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

  setupGit();

  const currentVersion = execSyncRead(`npm view remx version`);
  console.log(`current version is: ${currentVersion}`);
  const newVersion = semver.inc(currentVersion, `patch`);
  console.log(`new version is: ${newVersion}`);

  const npmrcPath = p.resolve(`${__dirname}/.npmrc`);
  execSync(`cp -rf ${npmrcPath} .`);

  execSync(`npm version ${newVersion} -m ${newVersion} [ci skip]`);

  execSyncSilently(`git push deploy --tags`);
  execSync(`npm publish`);
}

run();
