<%= projectDisplayName %>
=========================

A <%= projectDisplayName %>

This API aims to ...

How to use
----------

Requirements:

    * Docker (by the time this was written the latest release is v17.12.0-ce)
    * Docker Compose (by the time this was written the latest release is v1.18.0)
    * Node.js (tested with v8.9.4)
    * npm (tested with v5.6.0)

We're using `dotenv` files, you can check the available environment variables
and their default values in the file located in `src/config/environment/default.js`
and in the end of this file.

Development/local environment:

    npm install

Running the tests (config file: `src/config/environment/test.js`):

    npm test

Running the mock server:

    npm run mock-server

**NOTE:** Whenever you update the documentation (located in the `apib` folder) make sure to install
and recreate the `apib/collection.postman` file. You can check the installation steps of
[apiary2postman](https://github.com/thecopy/apiary2postman) lib.
This file is a postman collection and after having the `apiary2postman` created you can recreate the
file with the following command (from project root directory):

    apiary2postman blueprint apib/examples.md > apib/collection.postman

Running locally with Docker/Docker Compose:

    docker-compose up

Running locally without Docker/Docker Compose:

    npm run local

stage env (config file: `.env-stage`):

    npm install --only=production
    NODE_CONFIG_DIR=./src/config NODE_ENV=stage npm run start

production env (config file: `.env-production`):

    npm install --only=production
    NODE_CONFIG_DIR=./src/config NODE_ENV=production npm run start

**NOTE:** The required environment variables are:

    NODE_CONFIG_DIR
    NODE_ENV
    AWS_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY
