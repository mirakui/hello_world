import 'babel-polyfill'
import AWS from 'aws-sdk'
import _gm from 'gm'

const gm = _gm.subClass({ imageMagick: true, appPath: '/usr/local/bin/' })

function s3Get(bucket, key) {
  const s3 = new AWS.S3()
  const params = {
    Bucket: bucket,
    Key: key
  }
  return new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(data)
      }
    })
  })
}

function resize(data, width, height, outpath) {
  return new Promise((resolve, reject) => {
    gm(data).
      resize(width, height).
      write(outpath, (err) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(outpath)
        }
      })
  })
}

async function main() {
  const resp = await s3Get('mirakui-img', 'test/1/1.jpg')
  const out = await resize(resp.Body, 100, 100, 'out.jpg')
  return out
}

main().then( x => console.log(x) ).catch( e => console.error(e) )

