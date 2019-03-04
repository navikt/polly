#!/bin/bash
echo "$DOCKER_PASSWORD" | docker login -u "ketillfenne" --password-stdin
docker push "$DOCKER_IMAGE_FULL_NAME"