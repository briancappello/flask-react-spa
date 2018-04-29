#!/bin/sh

test -e frontend/app/config.js || (
   echo "WARNING: config.js not found, using default" &&\
   cp frontend/app/config.example.js frontend/app/config.js
)

npm run build:dll
ANALYZER_HOST="0.0.0.0" npm run start
