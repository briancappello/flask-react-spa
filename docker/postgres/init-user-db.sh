#!/bin/bash

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOL
   CREATE USER flask_api WITH PASSWORD 'flask_api' CREATEDB;
   CREATE DATABASE flask_api;
   GRANT ALL PRIVILEGES ON DATABASE flask_api TO flask_api;
EOL
