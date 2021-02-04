const execSync = require('child_process').execSync;
// import { execSync } from 'child_process';  // replace ^ if using ES modules
const output = execSync('jupyter lab', { encoding: 'utf-8' });  // the default is 'buffer'
console.log('Output was:\n', output);
console.log(execSync);