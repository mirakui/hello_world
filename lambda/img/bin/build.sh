#!/bin/bash -ex

MAGICK_VERSION=6.9.4-8

rsync -avz --delete ../../node_modules/ ./node_modules/

if [ ! -d ./opt ]; then
  TARBALL_PATH="ImageMagick-${MAGICK_VERSION}.lambda.tar.gz"
  aws s3 cp "s3://static.mirakui.com/archives/${TARBALL_PATH}" .
  mkdir opt/
  tar xvf ${TARBALL_PATH} -C opt/
  rm ${TARBALL_PATH}
fi

