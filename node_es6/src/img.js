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

function s3Put(bucket, key, data) {
  const s3 = new AWS.S3()
  const params = {
    Bucket: bucket,
    Key: key,
    Body: data
  }
  return new Promise((resolve, reject) => {
    s3.putObject(params, (err, data) => {
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
      toBuffer('JPG', (err, buffer) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(buffer)
        }
      })
  })
}

function main() {
  const key = 'test/1/1.jpg'
  s3Get('mirakui-img', key).then(
    resp => resize(resp.Body, 100, 100, 'out.jpg')
  ).then(
    buffer => s3Put('mirakui-img-deliver', key, buffer)
  ).catch(
    e => console.error(e)
  )
  return { key: key }
}

main()
// main().then( x => console.log(x) ).catch( e => console.error(e) )

