#!/bin/bash

cd ../../../../

PLATFORM=linux/$1 npm run staging:compose:build nginx-pt

docker push "$2/pipe-timer-frontend:$3"
