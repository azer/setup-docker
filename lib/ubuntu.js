var serially = require("serially");
var remotely = require("remotely");
var debug = require("local-debug")('ubuntu');

module.exports = {
  installDocker: installDocker
};

function installDocker (ip, callback) {
  debug('Installing Docker on %s', ip);

  serially()
    .then(remotely, [ip, 'apt-get update'])
    .then(remotely, [ip, 'apt-get -y install linux-image-extra-`uname -r`'])
    .then(remotely, [ip, 'apt-key -y adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 36A1D7869245C8950F966E92D8576A8BA88D21E9'])
    .then(remotely, [ip, "sh -c \"echo 'deb http://get.docker.io/ubuntu docker main' >> /etc/apt/sources.list\""])
    .then(remotely, [ip, 'apt-get update'])
    .then(aptGetDocker, [ip])
    .done(callback);
}

function aptGetDocker (ip, callback) {
  var cmd = remotely(ip, 'apt-get -y install lxc-docker');
  cmd.stdout.pipe(process.stdout);
  cmd.stderr.pipe(process.stderr);
  cmd.on('close', callback);
}

/*function cloneRepo (ip, callback) {
  debug('Clonning Docker repo to %s', ip);
  var cmd = remotely(ip, 'source ~/.profile && cd $GOPATH/src/github.com/dotcloud && rm -rf docker && git clone https://github.com/dotcloud/docker.git');
  cmd.stdout.pipe(process.stdout);
  cmd.stderr.pipe(process.stderr);
  cmd.on('close', callback);
}

function getDockerDependencies (ip, callback) {
  debug('Getting Docker dependencies installed on %s', ip);
  var cmd = remotely(ip, 'source ~/.profile && cd $GOPATH/src/github.com/dotcloud/docker && go get -v github.com/dotcloud/docker/...');
  cmd.stdout.pipe(process.stdout);
  cmd.stderr.pipe(process.stderr);
  cmd.on('close', callback);
}

function installDependencies (ip, callback) {
  debug('Installing dependencies on %s', ip);
  var cmd = remotely(ip, 'apt-get -y install lxc curl xz-utils git mercurial');
  cmd.stdout.pipe(process.stdout);
  cmd.stderr.pipe(process.stderr);
  cmd.on('close', callback);
}

function downloadGo (ip, callback) {
  debug('Downloading Go');

  var cmd = remotely(ip, 'wget http://go.googlecode.com/files/go1.1.1.linux-amd64.tar.gz');
  cmd.stdout.pipe(process.stdout);
  cmd.stderr.pipe(process.stderr);
  cmd.on('close', callback);
}

function installGo (ip, callback) {
  debug('Installing Go on %s', ip);

  serially()
    .then(remotely, [ip, 'tar xf go1.1.1.linux-amd64.tar.gz'])
    .then(remotely, [ip, 'rm -f go1.1.1.linux-amd64.tar.gz'])
    .then(remotely, [ip, 'echo "export GOROOT=\\$HOME/go" >> ~/.profile && echo "PATH=\\$PATH:\\$GOROOT/bin" >> ~/.profile'])
    .then(remotely, [ip, 'source ~/.profile && mkdir -p ~/gocode && echo "export GOPATH=\\$HOME/gocode" >> ~/.profile && echo "PATH=\\$PATH:\\$GOPATH/bin" >> ~/.profile'])
    .done(callback);
}
*/
