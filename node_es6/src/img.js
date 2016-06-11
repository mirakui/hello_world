import 'babel-polyfill'
import AWS from 'aws-sdk'

async function main() {
  let s3 = new AWS.S3()
  let params = {
    Bucket: 'mirakui-img',
    Key: 'test/1/1.jpg'
  }
  let data = await new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(data)
      }
    })
  })
  console.log('data.length = ' + data.length)
  return data
}

console.log('start')
main().then( x => console.log(x) ).catch( e => console.error(e) )

