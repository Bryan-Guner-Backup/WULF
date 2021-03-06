"use strict";

var tls = require("./tls");
var url = require("./url");
var http = require("./http");
var util = require("./util");
var inherits = util.inherits;
var debug = util.debuglog("https");

function Server(opts, requestListener) {
  if (!(this instanceof Server)) return new Server(opts, requestListener);

  if (process.features.tls_npn && !opts.NPNProtocols) {
    opts.NPNProtocols = ["http/1.1", "http/1.0"];
  }

  tls.Server.call(this, opts, http._connectionListener);

  this.httpAllowHalfOpen = false;

  if (requestListener) {
    this.addListener("request", requestListener);
  }

  this.addListener("clientError", function (err, conn) {
    conn.destroy();
  });

  this.timeout = 2 * 60 * 1000;
}
inherits(Server, tls.Server);
exports.Server = Server;

Server.prototype.setTimeout = http.Server.prototype.setTimeout;

exports.createServer = function (opts, requestListener) {
  return new Server(opts, requestListener);
};

// HTTPS agents.

function createConnection(port, host, options) {
  if (port !== null && typeof port === "object") {
    options = port;
  } else if (host !== null && typeof host === "object") {
    options = host;
  } else if (options === null || typeof options !== "object") {
    options = {};
  }

  if (typeof port === "number") {
    options.port = port;
  }

  if (typeof host === "string") {
    options.host = host;
  }

  debug("createConnection", options);

  if (options._agentKey) {
    var session = this._getSession(options._agentKey);
    if (session) {
      debug("reuse session for %j", options._agentKey);
      options = util._extend(
        {
          session: session,
        },
        options
      );
    }
  }

  var self = this;
  var socket = tls.connect(options, function () {
    if (!options._agentKey) return;

    self._cacheSession(options._agentKey, socket.getSession());
  });
  return socket;
}

function Agent(options) {
  http.Agent.call(this, options);
  this.defaultPort = 443;
  this.protocol = "https:";
  this.maxCachedSessions = this.options.maxCachedSessions;
  if (this.maxCachedSessions === undefined) this.maxCachedSessions = 100;

  this._sessionCache = {
    map: {},
    list: [],
  };
}
inherits(Agent, http.Agent);
Agent.prototype.createConnection = createConnection;

Agent.prototype.getName = function (options) {
  var name = http.Agent.prototype.getName.call(this, options);

  name += ":";
  if (options.ca) name += options.ca;

  name += ":";
  if (options.cert) name += options.cert;

  name += ":";
  if (options.ciphers) name += options.ciphers;

  name += ":";
  if (options.key) name += options.key;

  name += ":";
  if (options.pfx) name += options.pfx;

  name += ":";
  if (options.rejectUnauthorized !== undefined)
    name += options.rejectUnauthorized;

  return name;
};

Agent.prototype._getSession = function _getSession(key) {
  return this._sessionCache.map[key];
};

Agent.prototype._cacheSession = function _cacheSession(key, session) {
  // Fast case - update existing entry
  if (this._sessionCache.map[key]) {
    this._sessionCache.map[key] = session;
    return;
  }

  // Put new entry
  if (this._sessionCache.list.length >= this.maxCachedSessions) {
    var oldKey = this._sessionCache.list.shift();
    debug("evicting %j", oldKey);
    delete this._sessionCache.map[oldKey];
  }

  this._sessionCache.list.push(key);
  this._sessionCache.map[key] = session;
};

var globalAgent = new Agent();

exports.globalAgent = globalAgent;
exports.Agent = Agent;

exports.request = function (options, cb) {
  if (typeof options === "string") {
    options = url.parse(options);
  } else {
    options = util._extend({}, options);
  }
  options._defaultAgent = globalAgent;
  return http.request(options, cb);
};

exports.get = function (options, cb) {
  var req = exports.request(options, cb);
  req.end();
  return req;
};
