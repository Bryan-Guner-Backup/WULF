/**
 * angular-strap
 * @version v2.2.1 - 2015-05-15
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com> (https://github.com/mgcrea)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"use strict";

angular.module("mgcrea.ngStrap").run([
  "$templateCache",
  function ($templateCache) {
    $templateCache.put(
      "tooltip/tooltip.tpl.html",
      '<div class="tooltip in" ng-show="title"><div class="tooltip-arrow"></div><div class="tooltip-inner" ng-bind="title"></div></div>'
    );
  },
]);
