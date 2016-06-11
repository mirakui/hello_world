import 'babel-polyfill'
import { exec } from 'child_process'

function sh(cmd) {
  return new Promise((resolve, reject) => {
    console.log('enter promise')
    exec(cmd, (error, stdout, stderr) => {
      console.log('stdout = ' + stdout)
      if (error) {
        reject(error)
      }
      else {
        resolve({ stdout: stdout, stderr: stderr })
      }
    })
  })
}

async function main() {
  const x = await sh('node --version')
  console.log(x)
  return 'ok'
}

main().then( x => console.log('finished: ' + x) )
