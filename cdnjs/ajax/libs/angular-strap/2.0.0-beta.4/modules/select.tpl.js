/**
 * angular-strap
 * @version v2.0.0-beta.4 - 2014-01-20
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
angular.module("mgcrea.ngStrap.select").run([
  "$templateCache",
  function ($templateCache) {
    "use strict";

    $templateCache.put(
      "select/select.tpl.html",
      '<ul tabindex="-1" class="select dropdown-menu" ng-show="$isVisible()" role="select"><li role="presentation" ng-repeat="match in $matches" ng-class="{active: $isActive($index)}"><a role="menuitem" tabindex="-1" ng-click="$select($index, $event)" ng-bind="match.label"></a> <i class="glyphicon glyphicon-ok" ng-if="$isMultiple"></i></li></ul>'
    );
  },
]);
