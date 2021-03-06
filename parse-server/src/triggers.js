// triggers.js
import Parse    from 'parse/node';
import AppCache from './cache';
import { logger } from './logger';

export const Types = {
  beforeSave: 'beforeSave',
  afterSave: 'afterSave',
  beforeDelete: 'beforeDelete',
  afterDelete: 'afterDelete'
};

const baseStore = function() {
  let Validators = {};
  let Functions = {};
  let Jobs = {};
  let Triggers = Object.keys(Types).reduce(function(base, key){
    base[key] = {};
    return base;
  }, {});

  return Object.freeze({
    Functions,
    Jobs,
    Validators,
    Triggers
  });
};

const _triggerStore = {};

export function addFunction(functionName, handler, validationHandler, applicationId) {
  applicationId = applicationId || Parse.applicationId;
  _triggerStore[applicationId] =  _triggerStore[applicationId] || baseStore();
  _triggerStore[applicationId].Functions[functionName] = handler;
  _triggerStore[applicationId].Validators[functionName] = validationHandler;
}

export function addJob(jobName, handler, applicationId) {
  applicationId = applicationId || Parse.applicationId;
  _triggerStore[applicationId] =  _triggerStore[applicationId] || baseStore();
  _triggerStore[applicationId].Jobs[jobName] = handler;
}

export function addTrigger(type, className, handler, applicationId) {
  applicationId = applicationId || Parse.applicationId;
  _triggerStore[applicationId] =  _triggerStore[applicationId] || baseStore();
  _triggerStore[applicationId].Triggers[type][className] = handler;
}

export function removeFunction(functionName, applicationId) {
   applicationId = applicationId || Parse.applicationId;
   delete _triggerStore[applicationId].Functions[functionName]
}

export function removeJob(jobName, applicationId) {
   applicationId = applicationId || Parse.applicationId;
   delete _triggerStore[applicationId].Jobs[jobName]
}

export function removeTrigger(type, className, applicationId) {
   applicationId = applicationId || Parse.applicationId;
   delete _triggerStore[applicationId].Triggers[type][className]
}

export function _unregister(appId,category,className,type) {
  if (type) {
    removeTrigger(className,type,appId);
    delete _triggerStore[appId][category][className][type];
  } else {
    delete _triggerStore[appId][category][className];
  }
}

export function _unregisterAll() {
  Object.keys(_triggerStore).forEach(appId => delete _triggerStore[appId]);
}

export function getTrigger(className, triggerType, applicationId) {
  if (!applicationId) {
    throw "Missing ApplicationID";
  }
  var manager = _triggerStore[applicationId]
  if (manager
    && manager.Triggers
    && manager.Triggers[triggerType]
    && manager.Triggers[triggerType][className]) {
    return manager.Triggers[triggerType][className];
  }
  return undefined;
};

export function triggerExists(className: string, type: string, applicationId: string): boolean {
  return (getTrigger(className, type, applicationId) != undefined);
}

export function getFunction(functionName, applicationId) {
  var manager = _triggerStore[applicationId];
  if (manager && manager.Functions) {
    return manager.Functions[functionName];
  };
  return undefined;
}

export function getJob(jobName, applicationId) {
  var manager = _triggerStore[applicationId];
  if (manager && manager.Jobs) {
    return manager.Jobs[jobName];
  };
  return undefined;
}

export function getJobs(applicationId) {
  var manager = _triggerStore[applicationId];
  if (manager && manager.Jobs) {
    return manager.Jobs;
  };
  return undefined;
}


export function getValidator(functionName, applicationId) {
  var manager = _triggerStore[applicationId];
  if (manager && manager.Validators) {
    return manager.Validators[functionName];
  };
  return undefined;
}

export function getRequestObject(triggerType, auth, parseObject, originalParseObject, config) {
  var request = {
    triggerName: triggerType,
    object: parseObject,
    master: false,
    log: config.loggerController
  };

  if (originalParseObject) {
    request.original = originalParseObject;
  }

  if (!auth) {
    return request;
  }
  if (auth.isMaster) {
    request['master'] = true;
  }
  if (auth.user) {
    request['user'] = auth.user;
  }
  if (auth.installationId) {
    request['installationId'] = auth.installationId;
  }
  return request;
}

// Creates the response object, and uses the request object to pass data
// The API will call this with REST API formatted objects, this will
// transform them to Parse.Object instances expected by Cloud Code.
// Any changes made to the object in a beforeSave will be included.
export function getResponseObject(request, resolve, reject) {
  return {
    success: function(response) {
      // Use the JSON response
      if (response && !request.object.equals(response)
          && request.triggerName === Types.beforeSave) {
        return resolve(response);
      }
      response = {};
      if (request.triggerName === Types.beforeSave) {
        response['object'] = request.object._getSaveJSON();
      }
      return resolve(response);
    },
    error: function(code, message) {
      if (!message) {
        message = code;
        code = Parse.Error.SCRIPT_FAILED;
      }
      var scriptError = new Parse.Error(code, message);
      return reject(scriptError);
    }
  }
};

function userIdForLog(auth) {
  return (auth && auth.user) ? auth.user.id : undefined;
}

function logTriggerAfterHook(triggerType, className, input, auth) {
  const cleanInput = logger.truncateLogMessage(JSON.stringify(input));
  logger.info(`${triggerType} triggered for ${className} for user ${userIdForLog(auth)}:\n  Input: ${cleanInput}`, {
    className,
    triggerType,
    user: userIdForLog(auth)
  });
}

function logTriggerSuccessBeforeHook(triggerType, className, input, result, auth) {
  const cleanInput = logger.truncateLogMessage(JSON.stringify(input));
  const cleanResult = logger.truncateLogMessage(JSON.stringify(result));
  logger.info(`${triggerType} triggered for ${className} for user ${userIdForLog(auth)}:\n  Input: ${cleanInput}\n  Result: ${cleanResult}`, {
    className,
    triggerType,
    user: userIdForLog(auth)
  });
}

function logTriggerErrorBeforeHook(triggerType, className, input, auth, error) {
  const cleanInput = logger.truncateLogMessage(JSON.stringify(input));
  logger.error(`${triggerType} failed for ${className} for user ${userIdForLog(auth)}:\n  Input: ${cleanInput}\n  Error: ${JSON.stringify(error)}`, {
    className,
    triggerType,
    error,
    user: userIdForLog(auth)
  });
}


// To be used as part of the promise chain when saving/deleting an object
// Will resolve successfully if no trigger is configured
// Resolves to an object, empty or containing an object key. A beforeSave
// trigger will set the object key to the rest format object to save.
// originalParseObject is optional, we only need that for before/afterSave functions
export function maybeRunTrigger(triggerType, auth, parseObject, originalParseObject, config) {
  if (!parseObject) {
    return Promise.resolve({});
  }
  return new Promise(function (resolve, reject) {
    var trigger = getTrigger(parseObject.className, triggerType, config.applicationId);
    if (!trigger) return resolve();
    var request = getRequestObject(triggerType, auth, parseObject, originalParseObject, config);
    var response = getResponseObject(request, (object) =>??{
      logTriggerSuccessBeforeHook(
          triggerType, parseObject.className, parseObject.toJSON(), object, auth);
      resolve(object);
    }, (error) =>??{
      logTriggerErrorBeforeHook(
          triggerType, parseObject.className, parseObject.toJSON(), auth, error);
      reject(error);
    });
    // Force the current Parse app before the trigger
    Parse.applicationId = config.applicationId;
    Parse.javascriptKey = config.javascriptKey || '';
    Parse.masterKey = config.masterKey;

    // AfterSave and afterDelete triggers can return a promise, which if they
    // do, needs to be resolved before this promise is resolved,
    // so trigger execution is synced with RestWrite.execute() call.
    // If triggers do not return a promise, they can run async code parallel
    // to the RestWrite.execute() call.
    var triggerPromise = trigger(request, response);
    if(triggerType === Types.afterSave || triggerType === Types.afterDelete)
    {
        logTriggerAfterHook(triggerType, parseObject.className, parseObject.toJSON(), auth);
        if(triggerPromise && typeof triggerPromise.then === "function") {
            return triggerPromise.then(resolve, resolve);
        }
        else {
            return resolve();
        }
    }
  });
};

// Converts a REST-format object to a Parse.Object
// data is either className or an object
export function inflate(data, restObject) {
  var copy = typeof data == 'object' ? data : {className: data};
  for (var key in restObject) {
    copy[key] = restObject[key];
  }
  return Parse.Object.fromJSON(copy);
}
