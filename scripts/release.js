/* eslint-disable no-console */
const exec = require('shell-utils').exec;
const semver = require('semver');
const fs = require('fs');

const ONLY_ON_BRANCH = 'origin/master';
const VERSION_TAG = 'latest';
const VERSION_INC = 'patch';

function run() {
  if (!validateEnv()) {
    return;
  }
  setupGit();
  createNpmRc();
  versionTagAndPublish();
}

function validateEnv() {
  if (process.env.BUILDKITE_PULL_REQUEST !== 'false') {
    console.log(`not publishing, BUILDKITE_PULL_REQUEST: ${process.env.BUILDKITE_PULL_REQUEST}`);
    return false;
  }

  return true;
}

function setupGit() {
  exec.execSyncSilent(`git config --global push.default simple`);
  exec.execSyncSilent(`git config --global user.email "${process.env.GIT_EMAIL}"`);
  exec.execSyncSilent(`git config --global user.name "${process.env.GIT_USER}"`);
  const remoteUrl = new RegExp(`https?://(\\S+)`).exec(exec.execSyncRead(`git remote -v`))[1];
  exec.execSyncSilent(`git remote add deploy "https://${process.env.GIT_USER}:${process.env.GIT_TOKEN}@${remoteUrl}"`);
  exec.execSync(`git checkout ${ONLY_ON_BRANCH}`);
}

function createNpmRc() {
  exec.execSync(`rm -f package-lock.json`);
  const content = `
email=\${NPM_EMAIL}
//registry.npmjs.org/:_authToken=\${NPM_TOKEN}
`;
  fs.writeFileSync(`.npmrc`, content);
}

function versionTagAndPublish() {
  const packageVersion = semver.clean(process.env.npm_package_version);
  const [packagePrereleaseComponent] = semver.prerelease(process.env.npm_package_version) || [];
  console.log(`package version: ${packageVersion}`);
  console.log(`package packagePrereleaseComponent: ${packagePrereleaseComponent}`);

  const currentPublished = findCurrentPublishedVersion();
  console.log(`current published version: ${currentPublished}`);

  const incIdentifier = packagePrereleaseComponent ? 'prerelease' : VERSION_INC;
  const version = semver.gt(packageVersion, currentPublished) ?
    packageVersion :
    semver.inc(currentPublished, incIdentifier, packagePrereleaseComponent);
  tryPublishAndTag(version);
}

function findCurrentPublishedVersion() {
  return exec.execSyncRead(`npm view ${process.env.npm_package_name} dist-tags.${VERSION_TAG}`);
}

function tryPublishAndTag(version) {
  let theCandidate = version;
  for (let retry = 0; retry < 5; retry++) {
    try {
      tagAndPublish(theCandidate);
      console.log(`Released ${theCandidate}`);
      return;
    } catch (err) {
      const alreadyPublished = err.toString().includes('You cannot publish over the previously published version');
      if (!alreadyPublished) {
        throw err;
      }
      console.log(`previously published. retrying with increased ${VERSION_INC}...`);
      theCandidate = semver.inc(theCandidate, VERSION_INC);
    }
  }
}

function tagAndPublish(newVersion) {
  console.log(`trying to publish ${newVersion}...`);
  exec.execSync(`npm --no-git-tag-version --allow-same-version version ${newVersion}`);
  exec.execSyncRead(`npm publish --tag ${VERSION_TAG}`);
  exec.execSync(`git tag -a ${newVersion} -m "${newVersion}"`);
  exec.execSyncSilent(`git push deploy ${newVersion} || true`);
}

run();
