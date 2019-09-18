#! /bin/bash
set -e

# Generate docker image tag
DATE=$(date +%Y-%m-%d)
GIT_HASH=$(git rev-parse --short HEAD)
echo "export IMAGE_TAG=${DATE}--${GIT_HASH}" >> $BASH_ENV
source $BASH_ENV

# write current tag to file
mkdir img_tag
echo $IMAGE_TAG >> img_tag/docker_img_tag

echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USER} --password-stdin

# Build internal frontend
docker build -t navikt/${IMAGE_NAME}:${IMAGE_TAG} .
docker push navikt/${IMAGE_NAME}:${IMAGE_TAG}