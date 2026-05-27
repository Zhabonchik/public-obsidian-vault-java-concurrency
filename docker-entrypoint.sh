#!/bin/sh
set -e
envsubst '${QUARTZ_PAGE_TITLE} ${QUARTZ_BASE_URL}' \
  < /quartz/quartz.config.default.yaml \
  > /tmp/quartz.config.patched.yaml
cp /tmp/quartz.config.patched.yaml /quartz/quartz.config.default.yaml

envsubst '${QUARTZ_PAGE_TITLE} ${QUARTZ_SHORT_NAME}' \
  < /quartz/quartz/static/manifest.json \
  > /tmp/manifest.patched.json
cp /tmp/manifest.patched.json /quartz/quartz/static/manifest.json

exec "$@"
