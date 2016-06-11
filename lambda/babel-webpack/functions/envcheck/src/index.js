import λ from 'apex.js'
import 'babel-polyfill'
import { exec } from 'child_process'

function sh(cmd) {
  return new Promise( (resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          resolve({stdout: stdout, stderr: stderr, error: error})
        }
        else {
          resolve({stdout: stdout, stderr: stderr})
        }
      })
  })
}

export default λ(e => {
  return sh(e.cmd)
})
