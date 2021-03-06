// FunctionsRouter.js

var express = require('express'),
    Parse = require('parse/node').Parse,
    triggers = require('../triggers');

import PromiseRouter from '../PromiseRouter';
import { promiseEnforceMasterKeyAccess } from '../middlewares';
import { jobStatusHandler } from '../StatusHandler';
import _ from 'lodash';
import { logger } from '../logger';

function parseObject(obj) {
  if (Array.isArray(obj)) {
      return obj.map((item) => {
        return parseObject(item);
      });
  } else if (obj && obj.__type == 'Date') {
    return Object.assign(new Date(obj.iso), obj);
  } else if (obj && obj.__type == 'File') {
    return Parse.File.fromJSON(obj);
  } else if (obj && typeof obj === 'object') {
    return parseParams(obj);
  } else {
    return obj;
  }
}

function parseParams(params) {
  return _.mapValues(params, parseObject);
}

export class FunctionsRouter extends PromiseRouter {

  mountRoutes() {
    this.route('POST', '/functions/:functionName', FunctionsRouter.handleCloudFunction);
    this.route('POST', '/jobs/:jobName', promiseEnforceMasterKeyAccess, function(req) {
      return FunctionsRouter.handleCloudJob(req);
    });
    this.route('POST', '/jobs', promiseEnforceMasterKeyAccess, function(req) {
      return FunctionsRouter.handleCloudJob(req);
    });
  }

  static handleCloudJob(req) {
    const jobName = req.params.jobName || req.body.jobName;
    const applicationId = req.config.applicationId;
    const jobHandler = jobStatusHandler(req.config);
    const jobFunction = triggers.getJob(jobName, applicationId);
    if (!jobFunction) {
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Invalid job.');
    }
    let params = Object.assign({}, req.body, req.query);
    params = parseParams(params);
    const request = {
      params: params,
      log: req.config.loggerController,
      headers: req.headers,
      jobName
    };
    const status = {
      success: jobHandler.setSucceeded.bind(jobHandler),
      error: jobHandler.setFailed.bind(jobHandler),
      message: jobHandler.setMessage.bind(jobHandler)
    }
    return jobHandler.setRunning(jobName, params).then((jobStatus) =>??{
      request.jobId = jobStatus.objectId
      // run the function async
      process.nextTick(() =>??{
        jobFunction(request, status);
      });
      return {
        headers: {
          'X-Parse-Job-Status-Id': jobStatus.objectId
        },
        response: {}
      }
    });
  }

  static createResponseObject(resolve, reject, message) {
    return {
      success: function(result) {
        resolve({
          response: {
            result: Parse._encode(result)
          }
        });
      },
      error: function(code, message) {
        if (!message) {
          message = code;
          code = Parse.Error.SCRIPT_FAILED;
        }
        reject(new Parse.Error(code, message));
      },
      message: message
    }
  }

  static handleCloudFunction(req) {
    const functionName = req.params.functionName;
    const applicationId = req.config.applicationId;
    const theFunction = triggers.getFunction(functionName, applicationId);
    const theValidator = triggers.getValidator(req.params.functionName, applicationId);
    if (theFunction) {      
      let params = Object.assign({}, req.body, req.query);
      params = parseParams(params);
      var request = {
        params: params,
        master: req.auth && req.auth.isMaster,
        user: req.auth && req.auth.user,
        installationId: req.info.installationId,
        log: req.config.loggerController,
        headers: req.headers,
        functionName
      };

      if (theValidator && typeof theValidator === "function") {
        var result = theValidator(request);
        if (!result) {
          throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'Validation failed.');
        }
      }

      return new Promise(function (resolve, reject) {
        const userString = (req.auth && req.auth.user) ? req.auth.user.id : undefined;
        const cleanInput = logger.truncateLogMessage(JSON.stringify(params));
        var response = FunctionsRouter.createResponseObject((result) => {
          try {
            const cleanResult = logger.truncateLogMessage(JSON.stringify(result.response.result));
            logger.info(`Ran cloud function ${functionName} for user ${userString} `
              + `with:\n  Input: ${cleanInput }\n  Result: ${cleanResult }`, {
              functionName,
              params,
              user: userString,
            });
            resolve(result);
          } catch (e) {
            reject(e);
          }
        }, (error) => {
          try {
            logger.error(`Failed running cloud function ${functionName} for `
              + `user ${userString} with:\n  Input: ${cleanInput}\n  Error: `
              + JSON.stringify(error), {
              functionName,
              error,
              params,
              user: userString
            });
            reject(error);
          } catch (e) {
            reject(e);
          }
        });
        // Force the keys before the function calls.
        Parse.applicationId = req.config.applicationId;
        Parse.javascriptKey = req.config.javascriptKey;
        Parse.masterKey = req.config.masterKey;
        theFunction(request, response);
      });
    } else {
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Invalid function.');
    }
  }
}
