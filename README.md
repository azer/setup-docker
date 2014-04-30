## setup-docker

Install Docker, build and run a Dockerfile as daemon in the specific remote machine.

## Install

```bash
$ npm install -g setup-docker
```

## Command-line Usage

```js
$ setup-docker redis Dockerfile root@192.168.1.172
```

Run `setup-docker -h` to see full options.

## Programmatical Usage

```js
var setup = require('setup-docker')

setup({ name: "my-app", ssh: 'root@192.168.2.30', dockerfile: 'path/to/Dockerfile', port: '80:8080' }, function (error) {
  if (error) throw error

  console.log('my-app is installed and running on 192.168.2.30')
});
```

## Distro Support
For now, it only supports Ubuntu 13 (on the host machine). PRs are welcome for other distros and other Ubuntu versions, see `lib/ubuntu.js` for extending it.

## Debugging

Enable logs by;

```bash
$ DEBUG=setup-docker:*
```
