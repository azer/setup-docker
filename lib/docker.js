var remotely = require("remotely");
var debug = require("local-debug")('docker');
var serially = require("serially");
var exec = require("child_process").exec;

module.exports = {
  isInstalled: isInstalled,
  setup: setup
};

function isInstalled (ip, callback) {
  remotely(ip, 'docker', function (error, stdout, stderr) {
    if (error) return callback(error);

    callback(undefined, !/command not found/.test(stderr));
  });
}

function build (name, ip, callback) {
  debug('Building the Dockerfile on %s', ip);

  var cmd = remotely(ip, 'cd ~/dockerfiles/'+name+' && docker build -t ' + name + ' .').on('close', callback);
  cmd.stdout.pipe(process.stdout);
  cmd.stderr.pipe(process.stderr);
}

function setup (options, callback) {
  debug('Setting up %s on %s', options.dockerfile, options.ip);

  serially()
    .then(copyDockerfile, [options.name, options.ip, options.dockerfile])
    .then(build, [options.name, options.ip])
    .then(run, [options])
    .done(callback);
}

function copyDockerfile (name, ip, dockerfile, callback) {
  var target = '~/dockerfiles/' + name;
  debug('Copying %s to %s:%s', dockerfile, ip, target);

  remotely(ip, 'mkdir -p ' + target, function (error) {
    if (error) return callback(error);

    exec('scp ' + dockerfile + ' ' + ip + ':' + target + '/Dockerfile', function (error, stdout, stderr) {
      if (error) return callback(error);
      callback();
    });
  });
}

function run (options, callback) {
  debug('Running image "%s" on %s', options.name, options.ip);

  var cmd = 'docker run';

  if (options.port) {
    cmd += ' -p ' + options.port;
  }

  cmd += ' -d '+ options.name;

  remotely(options.ip, cmd, callback);
}
