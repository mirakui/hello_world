import 'babel-polyfill'

const exec = require('child_process').exec;

exports.handle = (e, ctx, cb) => {
  exec('node --version', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    cb(null, { stdout: stdout, stderr: stderr });
  });
}
