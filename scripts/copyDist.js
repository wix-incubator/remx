/* Copy dist folder to the example project and restart the Webpack server */

const exec = require('shell-utils').exec;
const path = require('path');

const src = path.join(__dirname, '../dist');
const dist = path.join(__dirname, '../remx-usage-example/node_modules/remx/dist');

run();

function run() {
  exec.execSync(`mkdir -p ${dist}`);
  exec.execSync('npm run build');
  exec.execSync(`cp -r ${src}/* ${dist}`);

  // try to kill the webpack server if already running:
  exec.kill('remx-usage-example/node_modules/react-scripts/scripts/start.js');
  exec.execSyncSilent(`kill -9 $(ps -ef | grep remx-usage-example/node_modules/react-scripts/scripts/start.js | grep -v grep | awk '{print$2}')`);

  // handle different context for npm start and npm start-watch:
  if (process.cwd().endsWith('src')) {
    process.chdir('../remx-usage-example');
  } else {
    process.chdir('./remx-usage-example');
  }

  // run the webpack server:
  exec.execAsyncSilent('node ./node_modules/.bin/react-scripts start');
  process.chdir('../scripts');
}

