#!/bin/bash -ex

WEBP_VER=0.5.0
IM_VER=6.9.4-8

SRC_DIR=$HOME/src
TASK_DIR=/var/task
PREFIX=$TASK_DIR/opt
OPT_TGZ=$SRC_DIR/ImageMagick-${IM_VER}.lambda.tar.gz

sudo yum groupinstall -y "Development Tools"
sudo yum install -y ImageMagick-devel libpng-devel libwmf-devel

if [ ! -d $TASK_DIR ]; then
  sudo mkdir $TASK_DIR
  sudo chown $USER $TASK_DIR
fi
mkdir -p $PREFIX

test ! -d $SRC_DIR && mkdir -p $SRC_DIR

cd $SRC_DIR

wget "https://storage.googleapis.com/downloads.webmproject.org/releases/webp/libwebp-${WEBP_VER}.tar.gz"
tar xvf libwebp-${WEBP_VER}.tar.gz
cd libwebp-${WEBP_VER}
./configure --prefix=$PREFIX
make && make install

cd $SRC_DIR

wget "http://www.imagemagick.org/download/ImageMagick-${IM_VER}.tar.gz"
tar xvf ImageMagick-${IM_VER}.tar.gz
cd ImageMagick-${IM_VER}

./configure \
  --prefix=$PREFIX \
  --without-x \
  --without-perl \
  --without-threads \
  --disable-openmp \
  LDFLAGS="-L${PREFIX}/lib" \
  CFLAGS="-I${PREFIX}/include"
make && make install

cd $TASK_DIR
tar cvfz $OPT_TGZ $PREFIX

set +x
echo "build finished: ${OPT_TGZ}"

