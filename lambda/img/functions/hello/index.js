'use strict';

const isLambda = !!module.parent;
const AWS = require('aws-sdk');
const gm = require('gm').subClass({
  imageMagick: true,
  appPath: isLambda ? '/var/task/opt/bin/' : ''
});
const imgConfig = {
  thumbnailWidth: '1000',
  dstBucket: 'mirakui-img-deliver'
};

function s3Get(bucket, key) {
  console.log('s3Get: bucket=%s, key=%s', bucket, key);

  const s3 = new AWS.S3();
  const params = {
    Bucket: bucket,
    Key: key
  };
  return new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) => {
      if (err) {
        console.log('s3Get: [reject] %j', err);
        reject(err);
      }
      else {
        console.log('s3Get: [resolve]');
        resolve(data);
      }
    });
  });
}

function s3Put(bucket, key, data, meta) {
  console.log('s3Put: bucket=%s, key=%s, meta=%j', bucket, key, meta);

  const s3 = new AWS.S3();
  let params = {
    Bucket: bucket,
    Key: key,
    Body: data
  };
  console.log('s3Put: meta=%j', meta);
  for (const k in meta) {
    console.log('s3Put: k=%j', k);
  }
  console.log('s3Put: params=%j', meta);

  return new Promise((resolve, reject) => {
    s3.putObject(params, (err, data) => {
      if (err) {
        console.log('s3Put: [reject] %j', err);
        reject(err);
      }
      else {
        console.log('s3Put: [resolve]');
        resolve(data);
      }
    });
  });
}

function makeThumbnail(data) {
  console.log('makeThumbnail: size=%d', data.length);

  return new Promise((resolve, reject) => {
    gm(data).
      resize(`${imgConfig.thumbnailWidth}>`).
      define(`jpeg:size=${imgConfig.thumbnailWidth}`).
      limit('map', '0MiB').
      limit('disk', '0MiB').
      repage('+').
      out('-auto-orient').
      quality(90).
      colorspace('sRGB').
      strip().
      toBuffer('JPG', (err, buffer) => {
        if (err) {
          console.log('makeThumbnail: [reject] %j', err);
          reject(err);
        }
        else {
          console.log('makeThumbnail: [resolve]');
          resolve(buffer);
        }
      });
  });
}

function getGeometry(data) {
  console.log('getGeometry: size=%d', data.length);

  return new Promise((resolve, reject) => {
    gm(data).
      size((err, size) => {
        if (err) {
          console.log('getGeometry: [reject] %j', err);
          reject(err);
        }
        else {
          console.log('getGeometry: [resolve] %j', size);
          resolve([data, size]);
        }
      });
  });
}

function processObject(srcBucket, key) {
  return s3Get(srcBucket, key).then(
    (resp) => makeThumbnail(resp.Body)
  ).then(
    (buffer) => getGeometry(buffer)
  ).then(
    (arr) => {
      const buffer = arr[0], geom = arr[1];
      return s3Put(
        imgConfig.dstBucket, key, buffer,
        { 'X-ThumbnailWidth': geom.width, 'X-ThumbnailHeight': geom.height }
      );
    }
  ).then(
    () => Promise.resolve({ key: key, status: 'success' })
  ).catch(
    (e) => Promise.resolve({ key: key, status: 'error', error: e })
  );
}

exports.handle = function(e, ctx, cb) {
  console.log('processing event: %j', e);

  const promises = e.Records.map((record) => {
    if (!record.s3) { return null; }
    const srcBucket = record.s3.bucket.name;
    const key = record.s3.object.key;
    return processObject(srcBucket, key);
  });

  Promise.all(promises).then(
    (results) => cb(null, { results: results })
  );
};

function loadJsonFromStdin() {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin;
    let buf = '';
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', (chunk) => { buf += chunk; });
    stdin.on('end', () => resolve(JSON.parse(buf)));
  });
}

if (!isLambda) {
  loadJsonFromStdin().
    then((e) => exports.handle(e, {}, (_, results) => {
      console.log('results: %j', results);
    }));
}
