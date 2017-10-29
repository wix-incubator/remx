/**Copy dist folder to the example project and restart the Webpack server*/

const shell = require('child_process').execSync;
const src = __dirname + '/../dist';
const dist = __dirname + '/../remx-usage-example/node_modules/remx/dist';
shell(`mkdir -p ${dist}`);
shell('npm run build');
shell(`cp -r ${src}/* ${dist}`);

//try to kill the webpack server if already running:
try {
  shell(`kill -9 $(ps -ef | grep remx-usage-example/node_modules/react-scripts/scripts/start.js | grep -v grep | awk '{print$2}')`);
} catch (e) { }

//handle different context for npm start and npm start-watch:
if(process.cwd().endsWith('src')) {
  process.chdir('../remx-usage-example');
} else {
  process.chdir('./remx-usage-example');
  
}
//run the webpack server:
shell('node ./node_modules/.bin/react-scripts start > /dev/null 2>&1 &');
process.chdir('../scripts');

