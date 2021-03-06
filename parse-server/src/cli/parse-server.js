import path from 'path';
import express from 'express';
import { ParseServer } from '../index';
import definitions from './cli-definitions';
import program from './utils/commander';
import { mergeWithOptions } from './utils/commander';
import cluster from 'cluster';
import os from 'os';

program.loadDefinitions(definitions);

program
  .usage('[options] <path/to/configuration.json>');

program.on('--help', function(){
  console.log('  Get Started guide:');
  console.log('');
  console.log('    Please have a look at the get started guide!')
  console.log('    https://github.com/ParsePlatform/parse-server/wiki/Parse-Server-Guide');
  console.log('');
  console.log('');
  console.log('  Usage with npm start');
  console.log('');
  console.log('    $ npm start -- path/to/config.json');
  console.log('    $ npm start -- --appId APP_ID --masterKey MASTER_KEY --serverURL serverURL');
  console.log('    $ npm start -- --appId APP_ID --masterKey MASTER_KEY --serverURL serverURL');
  console.log('');
  console.log('');
  console.log('  Usage:');
  console.log('');
  console.log('    $ parse-server path/to/config.json');
  console.log('    $ parse-server -- --appId APP_ID --masterKey MASTER_KEY --serverURL serverURL');
  console.log('    $ parse-server -- --appId APP_ID --masterKey MASTER_KEY --serverURL serverURL');
  console.log('');
});

program.parse(process.argv, process.env);

let options = program.getOptions();

if (!options.serverURL) {
  options.serverURL = `http://localhost:${options.port}${options.mountPath}`;
}

if (!options.appId || !options.masterKey || !options.serverURL) {
  program.outputHelp();
  console.error("");
  console.error('\u001b[31mERROR: appId and masterKey are required\u001b[0m');
  console.error("");
  process.exit(1);
}

function logStartupOptions(options) {
  for (let key in options) {
    let value = options[key];
    if (key == "masterKey") {
      value = "***REDACTED***";
    }
    console.log(`${key}: ${value}`);
  }
}

function startServer(options, callback) {
  const app = express();
  const api = new ParseServer(options);
  app.use(options.mountPath, api);

  var server = app.listen(options.port, callback);

  var handleShutdown = function() {
    console.log('Termination signal received. Shutting down.');
    server.close(function () {
      process.exit(0);
    });
  };
  process.on('SIGTERM', handleShutdown);
  process.on('SIGINT', handleShutdown);
}

if (options.cluster) {
  const numCPUs = typeof options.cluster === 'number' ? options.cluster : os.cpus().length;
  if (cluster.isMaster) {
    logStartupOptions(options);
    for(var i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died... Restarting`);
      cluster.fork();
    });
  } else {
    startServer(options, () =>??{
      console.log('['+process.pid+'] parse-server running on '+options.serverURL);
    });
  }
} else {
  startServer(options, () => {
    logStartupOptions(options);
    console.log('');
    console.log('['+process.pid+'] parse-server running on '+options.serverURL);
  });
}

