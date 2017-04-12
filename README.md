# psl-lending
Service API to lend resources using Ethereum to log events

## Config

* Create files `notifications/ABI.txt` & `notifications/contractAddress.txt`:
```console
touch notifications/ABI.txt
touch notifications/contractAddress.txt
```

* Deploy the contract to peer (if not already done) & paste the ABI and the contract address in files created above.
  * ABI and contract address change after every deployment. If not updated accordingly, events will not be logged.

* Update `config/config.json` with values as per your configuration. Make sure you change the `gethUrl` to the IP where your geth client is running.
* Create a Firebase project and update `config/firebase-admin.json`.

## Deploying via Docker
* Install [docker](https://docs.docker.com/engine/installation/) and [docker-compose](https://docs.docker.com/compose/install/) based on your platform.

* Run docker container:
```console
docker-compose up --build
```

* App will run on port `3000` by default.

* Running via docker will set environment to `production`. So, production config values from `config/config.json` will be used.
  * Environment can be changed to `development` in the Dockerfile.

## Deploying normally
* Install `node v6.10.2` and `npm v4.4.4`.

* Set environment to production:
```console
export NODE_ENV=production
```

* Install modules and run:
```console
npm install
npm start
```

* App will run on port `3000` by default.

## Testing REST API
* Run `npm test`.

## Contributors
* [Aaron Colaco](http://aaroncolaco.com)

## License

MIT
