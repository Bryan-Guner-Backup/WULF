/**
 * angular-strap
 * @version v2.0.0-beta.3 - 2014-01-15
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"use strict";
angular
  .module("mgcrea.ngStrap.typeahead", [
    "mgcrea.ngStrap.tooltip",
    "mgcrea.ngStrap.helpers.parseOptions",
  ])
  .run([
    "$templateCache",
    function ($templateCache) {
      var template =
        "" +
        '<ul tabindex="-1" class="typeahead dropdown-menu" ng-show="$isVisible()" role="select">' +
        '<li role="presentation" ng-repeat="match in $matches" ng-class="{active: $index == $activeIndex}">' +
        '<a role="menuitem" tabindex="-1" ng-click="$select($index, $event)" ng-bind="match.label"></a>' +
        "</li>" +
        "</ul>";
      $templateCache.put("$typeahead", template);
    },
  ])
  .provider("$typeahead", function () {
    var defaults = (this.defaults = {
      animation: "animation-fade",
      prefixClass: "typeahead",
      placement: "bottom-left",
      template: "$typeahead",
      trigger: "focus",
      container: false,
      keyboard: true,
      html: false,
      delay: 0,
      minLength: 1,
      limit: 6,
    });
    this.$get = [
      "$window",
      "$rootScope",
      "$tooltip",
      function ($window, $rootScope, $tooltip) {
        var bodyEl = angular.element($window.document.body);
        function TypeaheadFactory(element, config) {
          var $typeahead = {};
          var options = angular.extend({}, defaults, config);
          var controller = options.controller;
          $typeahead = $tooltip(element, options);
          var parentScope = config.scope;
          var scope = $typeahead.$scope;
          scope.$matches = [];
          scope.$activeIndex = 0;
          scope.$activate = function (index) {
            scope.$$postDigest(function () {
              $typeahead.activate(index);
            });
          };
          scope.$select = function (index, evt) {
            scope.$$postDigest(function () {
              $typeahead.select(index);
            });
          };
          scope.$isVisible = function () {
            return $typeahead.$isVisible();
          };
          $typeahead.update = function (matches) {
            scope.$matches = matches;
            if (scope.$activeIndex >= matches.length) {
              scope.$activeIndex = 0;
            }
          };
          $typeahead.activate = function (index) {
            scope.$activeIndex = index;
          };
          $typeahead.select = function (index) {
            var value = scope.$matches[index].value;
            if (controller) {
              controller.$setViewValue(value);
              controller.$render();
              if (parentScope) parentScope.$digest();
            }
            if (options.trigger === "focus") element[0].blur();
            else if ($typeahead.$isShown) $typeahead.hide();
            scope.$activeIndex = 0;
            scope.$emit("$typeahead.select", value, index);
          };
          $typeahead.$isVisible = function () {
            if (!options.minLength || !controller) {
              return !!scope.$matches.length;
            }
            return (
              scope.$matches.length &&
              controller.$viewValue.length >= options.minLength
            );
          };
          $typeahead.$onMouseDown = function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
          };
          $typeahead.$onKeyDown = function (evt) {
            if (!/(38|40|13)/.test(evt.keyCode)) return;
            evt.preventDefault();
            evt.stopPropagation();
            if (evt.keyCode === 13) {
              return $typeahead.select(scope.$activeIndex);
            }
            if (evt.keyCode === 38 && scope.$activeIndex > 0)
              scope.$activeIndex--;
            else if (
              evt.keyCode === 40 &&
              scope.$activeIndex < scope.$matches.length - 1
            )
              scope.$activeIndex++;
            else if (angular.isUndefined(scope.$activeIndex))
              scope.$activeIndex = 0;
            scope.$digest();
          };
          var show = $typeahead.show;
          $typeahead.show = function () {
            show();
            setTimeout(function () {
              $typeahead.$element.on("mousedown", $typeahead.$onMouseDown);
              if (options.keyboard) {
                element.on("keydown", $typeahead.$onKeyDown);
              }
            });
          };
          var hide = $typeahead.hide;
          $typeahead.hide = function () {
            $typeahead.$element.off("mousedown", $typeahead.$onMouseDown);
            if (options.keyboard) {
              element.off("keydown", $typeahead.$onKeyDown);
            }
            hide();
          };
          return $typeahead;
        }
        TypeaheadFactory.defaults = defaults;
        return TypeaheadFactory;
      },
    ];
  })
  .directive("bsTypeahead", [
    "$window",
    "$parse",
    "$q",
    "$typeahead",
    "$parseOptions",
    function ($window, $parse, $q, $typeahead, $parseOptions) {
      var defaults = $typeahead.defaults;
      return {
        restrict: "EAC",
        require: "ngModel",
        link: function postLink(scope, element, attr, controller) {
          var options = {
            scope: scope,
            controller: controller,
          };
          angular.forEach(
            [
              "placement",
              "container",
              "delay",
              "trigger",
              "keyboard",
              "html",
              "animation",
              "template",
              "limit",
              "minLength",
            ],
            function (key) {
              if (angular.isDefined(attr[key])) options[key] = attr[key];
            }
          );
          var limit = options.limit || defaults.limit;
          var parsedOptions = $parseOptions(
            attr.ngOptions + " | filter:$viewValue |\xa0limitTo:" + limit
          );
          var typeahead = $typeahead(element, options);
          scope.$watch(attr.ngModel, function (newValue, oldValue) {
            parsedOptions.valuesFn(scope, controller).then(function (values) {
              if (values.length > limit) values = values.slice(0, limit);
              typeahead.update(values);
            });
          });
          scope.$on("$destroy", function () {
            typeahead.destroy();
            options = null;
            typeahead = null;
          });
        },
      };
    },
  ]);
