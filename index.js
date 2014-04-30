var debug = require("local-debug")('main');
var ubuntu = require("./lib/ubuntu");
var docker = require("./lib/docker");

module.exports = setup;

function setup (options, callback) {
  options.ip || (options.ip = options.ssh);

  debug('Starting to install %s on %s', options.dockerfile, options.ip);

  docker.isInstalled(options.ip, function (error, ready) {
    if (error) return callback(error);

    if (ready) {
      return docker.setup(options, callback);
    }

    ubuntu.installDocker(options.ip, function (error) {
      if (error) return callback(error);

      setup(options, callback);
    });
  });
}
