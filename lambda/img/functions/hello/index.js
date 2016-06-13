'use strict'

const AWS = require('aws-sdk')
const gm = require('gm').subClass({ imageMagick: true, appPath: '/usr/local/bin/' })

function s3Get(bucket, key, callback) {
  let s3 = new AWS.S3()
  let params = {
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
  let s3 = new AWS.S3()
  let params = {
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

function resize(data, width, height) {
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

exports.handle = function(e, ctx, cb) {
  console.log('processing event: %j', e)

  const key = 'test/1/1.jpg'
  s3Get('mirakui-img', key).then(
    resp => resize(resp.Body, 100, 100)
  ).then(
    buffer => s3Put('mirakui-img-deliver', key, buffer)
  ).catch(
    e => console.error(e)
  )
  cb(null, { key: 'key' })
}
