// deno-fmt-ignore-file
// deno-lint-ignore-file

// Copyright Joyent and Node contributors. All rights reserved. MIT license.
// Taken from Node 15.5.1
// This file is automatically generated by "node/_tools/setup.ts". Do not modify this file manually

'use strict';
require('../common');
const assert = require('assert');
const net = require('net');

assert.throws(() => net.createServer('path'),
              {
                code: 'ERR_INVALID_ARG_TYPE',
                name: 'TypeError'
              });

assert.throws(() => net.createServer(0),
              {
                code: 'ERR_INVALID_ARG_TYPE',
                name: 'TypeError'
              });