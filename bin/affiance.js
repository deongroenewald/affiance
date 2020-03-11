#! /usr/bin/env node
var program = require('commander');
module.exports = program;

var Logger = require('../lib/Logger');
var logger = new Logger({level: process.env.LOG_LEVEL});

program.command('install')
  .description('Install affiance into local git repo')
  .option('-f, --force', 'Force installation to replace existing hooks')
  .option('-u, --update', 'Update existing installation if necessary')
  .action(function(commandOptions) {
    let Installer = require('../lib/cli/Installer');
    new Installer(logger, {
      action: 'install',
      force: commandOptions.force,
      update: commandOptions.update
    }).run();
  });

program.command('uninstall')
  .description('Remove affiance from local git repo')
  .action(function(commandOptions) {
    var Installer = require('../lib/cli/Installer');
    new Installer(logger, {
      action: 'uninstall'
    }).run();
  });

program.command('sign')
  .description('Update signatures for config and hooks')
  .option('-h, --hook [hook]', 'Sign a specific hook')
  .action(function(commandOptions) {
    var Installer = require('../lib/cli/Installer');
    new Installer(logger, {
      action: 'sign',
      hookToSign: commandOptions.hook
    }).run();
  });

program.command('run')
  .description('Run all pre-commit hooks against the repo')
  // .option('-b, --base [commitish]', 'The base commit to use when linting. Will lint from this commit to HEAD.')
  .action(function(_commandOptions) {
    let Installer = require('../lib/cli/Installer');
    new Installer(logger, {
      action: 'run',
    }).run().then(function(result) {
      // We finished, use the result
      process.exit(result ? 0 : 65); // EX_DATAERR
    });
  });

program.command('version')
  .description('Output current version of affiance')
  .action(function(_commandOptions) {
    console.log(require('../package.json').version);
  });

program.parse(process.argv);


