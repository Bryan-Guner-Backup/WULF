/**
 * angular-strap
 * @version v2.1.3 - 2014-11-06
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes (olivier@mg-crea.com)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"use strict";

angular.module("mgcrea.ngStrap.select").run([
  "$templateCache",
  function ($templateCache) {
    $templateCache.put(
      "select/select.tpl.html",
      '<ul tabindex="-1" class="select dropdown-menu" ng-show="$isVisible()" role="select"><li ng-if="$showAllNoneButtons"><div class="btn-group" style="margin-bottom: 5px; margin-left: 5px"><button class="btn btn-default btn-xs" ng-click="$selectAll()">All</button> <button class="btn btn-default btn-xs" ng-click="$selectNone()">None</button></div></li><li role="presentation" ng-repeat="match in $matches" ng-class="{active: $isActive($index)}"><a style="cursor: default" role="menuitem" tabindex="-1" ng-click="$select($index, $event)"><span ng-bind="match.label"></span></a> <i style="cursor: default" class="{{$iconCheckmark}} pull-right" ng-if="$isMultiple && $isActive($index)" ng-click="$select($index, $event)"></i></li></ul>'
    );
  },
]);
