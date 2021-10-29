// deno-fmt-ignore-file
// deno-lint-ignore-file

// Copyright Joyent and Node contributors. All rights reserved. MIT license.
// Taken from Node 15.5.1
// This file is automatically generated by "node/_tools/setup.ts". Do not modify this file manually

'use strict';
require('../common');

// This test ensures that `net.Socket` does not inherit the no-half-open
// enforcer from `stream.Duplex`.

const { Socket } = require('net');
const { strictEqual } = require('assert');

const socket = new Socket({ allowHalfOpen: false });
strictEqual(socket.listenerCount('end'), 1);
