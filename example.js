var setup = require('./');

setup({ name: process.argv[2], dockerfile: process.argv[3], ip: process.argv[4] }, function (error) {
  if (error) throw error;

  console.log('%s is installed and running on %s', process.argv[2], process.argv[4]);
});
