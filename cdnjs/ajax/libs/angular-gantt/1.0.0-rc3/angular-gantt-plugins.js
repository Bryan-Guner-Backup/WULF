/*
Project: angular-gantt v1.0.0-rc3 - Gantt chart component for AngularJS
Authors: Marco Schweighauser, Rémi Alvergnat
License: MIT
Homepage: http://www.angular-gantt.com
Github: https://github.com/angular-gantt/angular-gantt.git
*/
angular.module("gantt.bounds.templates", []).run([
  "$templateCache",
  function ($templateCache) {
    $templateCache.put(
      "plugins/bounds/taskBounds.tmpl.html",
      '<div ng-cloak class="gantt-task-bounds" ng-style="getCss()" ng-class="getClass()"></div>\n' +
        ""
    );
  },
]);

angular
  .module("gantt.drawtask.templates", [])
  .run(["$templateCache", function ($templateCache) {}]);

angular
  .module("gantt.movable.templates", [])
  .run(["$templateCache", function ($templateCache) {}]);

angular.module("gantt.progress.templates", []).run([
  "$templateCache",
  function ($templateCache) {
    $templateCache.put(
      "plugins/progress/taskProgress.tmpl.html",
      '<div ng-cloak class="gantt-task-progress" ng-style="getCss()" ng-class="getClasses()"></div>\n' +
        ""
    );
  },
]);

angular
  .module("gantt.sortable.templates", [])
  .run(["$templateCache", function ($templateCache) {}]);

angular.module("gantt.tooltips.templates", []).run([
  "$templateCache",
  function ($templateCache) {
    $templateCache.put(
      "plugins/tooltips/tooltip.tmpl.html",
      '<div ng-cloak class="gantt-task-info">\n' +
        '    <div class="gantt-task-info-content">\n' +
        "        {{::task.model.name}}</br>\n" +
        "        <small>\n" +
        "            {{::task.isMilestone() === true && (getFromLabel()) || (getFromLabel() + ' - ' + getToLabel());}}\n" +
        "        </small>\n" +
        "    </div>\n" +
        "</div>\n" +
        ""
    );
  },
]);

(function () {
  "use strict";
  angular
    .module("gantt.bounds", ["gantt", "gantt.bounds.templates"])
    .directive("ganttBounds", [
      "moment",
      "$compile",
      "$document",
      function (moment, $compile, $document) {
        return {
          restrict: "E",
          require: "^gantt",
          scope: {
            enabled: "=?",
          },
          link: function (scope, element, attrs, ganttCtrl) {
            var api = ganttCtrl.gantt.api;

            // Load options from global options attribute.
            if (scope.options && typeof scope.options.bounds === "object") {
              for (var option in scope.options.bounds) {
                scope[option] = scope.options[option];
              }
            }

            if (scope.enabled === undefined) {
              scope.enabled = true;
            }

            api.directives.on.new(
              scope,
              function (directiveName, taskScope, taskElement) {
                if (directiveName === "ganttTask") {
                  var boundsScope = taskScope.$new();
                  boundsScope.pluginScope = scope;

                  var ifElement = $document[0].createElement("div");
                  angular
                    .element(ifElement)
                    .attr(
                      "data-ng-if",
                      "task.model.est && task.model.lct && pluginScope.enabled"
                    );
                  var boundsElement =
                    $document[0].createElement("gantt-task-bounds");
                  if (attrs.templateUrl !== undefined) {
                    angular
                      .element(boundsElement)
                      .attr("data-template-url", attrs.templateUrl);
                  }
                  if (attrs.template !== undefined) {
                    angular
                      .element(boundsElement)
                      .attr("data-template", attrs.template);
                  }
                  angular.element(ifElement).append(boundsElement);
                  taskElement.append($compile(ifElement)(boundsScope));
                }
              }
            );

            api.tasks.on.clean(scope, function (model) {
              if (model.est !== undefined && !moment.isMoment(model.est)) {
                model.est = moment(model.est); //Earliest Start Time
              }
              if (model.lct !== undefined && !moment.isMoment(model.lct)) {
                model.lct = moment(model.lct); //Latest Completion Time
              }
            });
          },
        };
      },
    ]);
})();

(function () {
  "use strict";
  angular.module("gantt.drawtask", ["gantt"]).directive("ganttDrawTask", [
    "ganttMouseOffset",
    "moment",
    function (mouseOffset, moment) {
      return {
        restrict: "E",
        require: "^gantt",
        scope: {
          enabled: "=?",
          taskModelFactory: "=taskFactory",
        },
        link: function (scope, element, attrs, ganttCtrl) {
          var api = ganttCtrl.gantt.api;

          if (scope.enabled === undefined) {
            scope.enabled = true;
          }

          api.directives.on.new(
            scope,
            function (directiveName, directiveScope, element) {
              if (directiveName === "ganttRow") {
                var drawHandler = function (evt) {
                  var evtTarget = evt.target ? evt.target : evt.srcElement;
                  if (
                    scope.enabled &&
                    evtTarget.className.indexOf("gantt-row") > -1
                  ) {
                    var startDate = api.core.getDateByPosition(
                      mouseOffset.getOffset(evt).x
                    );
                    var endDate = moment(startDate);

                    var taskModel = scope.taskModelFactory();
                    taskModel.from = startDate;
                    taskModel.to = endDate;

                    var task = directiveScope.row.addTask(taskModel);
                    task.isResizing = true;
                    task.updatePosAndSize();
                    directiveScope.row.updateVisibleTasks();

                    directiveScope.row.$scope.$digest();
                  }
                };

                element.on("mousedown", drawHandler);
                directiveScope.drawTaskHandler = drawHandler;
              }
            }
          );

          api.directives.on.destroy(
            scope,
            function (directiveName, directiveScope, element) {
              if (directiveName === "ganttRow") {
                element.off("mousedown", directiveScope.drawTaskHandler);
                delete directiveScope.drawTaskHandler;
              }
            }
          );
        },
      };
    },
  ]);
})();

(function () {
  "use strict";
  angular.module("gantt.movable", ["gantt"]).directive("ganttMovable", [
    "ganttMouseButton",
    "ganttMouseOffset",
    "ganttSmartEvent",
    "ganttMovableOptions",
    "ganttUtils",
    "$window",
    "$document",
    "$timeout",
    function (
      mouseButton,
      mouseOffset,
      smartEvent,
      movableOptions,
      utils,
      $window,
      $document,
      $timeout
    ) {
      // Provides moving and resizing of tasks
      return {
        restrict: "E",
        require: "^gantt",
        scope: {
          enabled: "=?",
          allowMoving: "=?",
          allowResizing: "=?",
          allowRowSwitching: "=?",
        },
        link: function (scope, element, attrs, ganttCtrl) {
          var api = ganttCtrl.gantt.api;

          // Load options from global options attribute.
          if (scope.options && typeof scope.options.movable === "object") {
            for (var option in scope.options.movable) {
              scope[option] = scope.options[option];
            }
          }

          movableOptions.initialize(scope);

          api.registerEvent("tasks", "move");
          api.registerEvent("tasks", "moveBegin");
          api.registerEvent("tasks", "moveEnd");
          api.registerEvent("tasks", "resize");
          api.registerEvent("tasks", "resizeBegin");
          api.registerEvent("tasks", "resizeEnd");
          api.registerEvent("tasks", "change");

          var _hasTouch =
            "ontouchstart" in $window ||
            ($window.DocumentTouch &&
              $document[0] instanceof $window.DocumentTouch);
          var _pressEvents = "touchstart mousedown";
          var _moveEvents = "touchmove mousemove";
          var _releaseEvents = "touchend mouseup";

          var resizeAreaWidthBig = 5;
          var resizeAreaWidthSmall = 3;
          var scrollSpeed = 15;
          var scrollTriggerDistance = 5;
          var mouseStartOffsetX;
          var moveStartX;

          api.directives.on.new(
            scope,
            function (directiveName, taskScope, taskElement) {
              if (directiveName === "ganttTask") {
                var windowElement = angular.element($window);
                var ganttBodyElement =
                  taskScope.row.rowsManager.gantt.body.$element;
                var ganttScrollElement =
                  taskScope.row.rowsManager.gantt.scroll.$element;

                var taskHasBeenChanged = false;
                var scrollInterval;

                taskElement.on(_pressEvents, function (evt) {
                  evt.preventDefault();
                  if (_hasTouch) {
                    evt = mouseOffset.getTouch(evt);
                  }
                  var enabled = utils.firstProperty(
                    [
                      taskScope.task.model.movable,
                      taskScope.task.row.model.movable,
                    ],
                    "enabled",
                    scope.enabled
                  );
                  if (enabled) {
                    var taskOffsetX = mouseOffset.getOffset(evt).x;
                    var mode = getMoveMode(taskOffsetX);
                    if (mode !== "" && mouseButton.getButton(evt) === 1) {
                      var bodyOffsetX = mouseOffset.getOffsetForElement(
                        ganttBodyElement[0],
                        evt
                      ).x;
                      enableMoveMode(mode, bodyOffsetX);
                    }
                    taskScope.$digest();
                  }
                });

                taskElement.on("mousemove", function (evt) {
                  var enabled = utils.firstProperty(
                    [
                      taskScope.task.model.movable,
                      taskScope.task.row.model.movable,
                    ],
                    "enabled",
                    scope.enabled
                  );
                  if (enabled) {
                    var taskOffsetX = mouseOffset.getOffset(evt).x;
                    var mode = getMoveMode(taskOffsetX);
                    if (
                      mode !== "" &&
                      (taskScope.task.isMoving || mode !== "M")
                    ) {
                      taskElement.css("cursor", getCursor(mode));
                    } else {
                      taskElement.css("cursor", "");
                    }
                  }
                });

                var handleMove = function (mode, evt) {
                  moveTask(mode, evt);
                  scrollScreen(mode, evt);
                };

                var moveTask = function (mode, evt) {
                  var mousePos = mouseOffset.getOffsetForElement(
                    ganttBodyElement[0],
                    evt
                  );
                  var x = mousePos.x;
                  taskScope.task.mouseOffsetX = x;

                  if (mode === "M") {
                    var allowRowSwitching = utils.firstProperty(
                      [
                        taskScope.task.model.movable,
                        taskScope.task.row.model.movable,
                      ],
                      "allowRowSwitching",
                      scope.allowRowSwitching
                    );
                    if (allowRowSwitching) {
                      var scrollRect =
                        ganttScrollElement[0].getBoundingClientRect();

                      var targetRowElement = utils.findElementFromPoint(
                        scrollRect.left,
                        evt.clientY,
                        function (element) {
                          return angular.element(element).hasClass("gantt-row");
                        }
                      );
                      var rows = ganttCtrl.gantt.rowsManager.rows;
                      var targetRow;
                      for (var i = 0, l = rows.length; i < l; i++) {
                        if (targetRowElement === rows[i].$element[0]) {
                          targetRow = rows[i];
                          break;
                        }
                      }

                      var sourceRow = taskScope.task.row;

                      if (targetRow !== undefined && sourceRow !== targetRow) {
                        targetRow.moveTaskToRow(taskScope.task, true);
                        sourceRow.$scope.$digest();
                        targetRow.$scope.$digest();
                      }
                    }

                    var allowMoving = utils.firstProperty(
                      [
                        taskScope.task.model.movable,
                        taskScope.task.row.model.movable,
                      ],
                      "allowMoving",
                      scope.allowMoving
                    );
                    if (allowMoving) {
                      x = x - mouseStartOffsetX;
                      if (taskScope.taskOutOfRange !== "truncate") {
                        if (x < 0) {
                          x = 0;
                        } else if (
                          x + taskScope.task.width >=
                          taskScope.gantt.width
                        ) {
                          x = taskScope.gantt.width - taskScope.task.width;
                        }
                      }
                      taskScope.task.moveTo(x);
                      taskScope.$digest();
                      taskScope.row.rowsManager.gantt.api.tasks.raise.move(
                        taskScope.task
                      );
                    }
                  } else if (mode === "E") {
                    if (taskScope.taskOutOfRange !== "truncate") {
                      if (x < taskScope.task.left) {
                        x = taskScope.task.left;
                      } else if (x > taskScope.gantt.width) {
                        x = taskScope.gantt.width;
                      }
                    }
                    taskScope.task.setTo(x);
                    taskScope.$digest();
                    taskScope.row.rowsManager.gantt.api.tasks.raise.resize(
                      taskScope.task
                    );
                  } else {
                    if (taskScope.taskOutOfRange !== "truncate") {
                      if (x > taskScope.task.left + taskScope.task.width) {
                        x = taskScope.task.left + taskScope.task.width;
                      } else if (x < 0) {
                        x = 0;
                      }
                    }
                    taskScope.task.setFrom(x);
                    taskScope.$digest();
                    taskScope.row.rowsManager.gantt.api.tasks.raise.resize(
                      taskScope.task
                    );
                  }

                  taskHasBeenChanged = true;
                };

                var scrollScreen = function (mode, evt) {
                  var mousePos = mouseOffset.getOffsetForElement(
                    ganttBodyElement[0],
                    evt
                  );
                  var leftScreenBorder = ganttScrollElement[0].scrollLeft;
                  var screenWidth = ganttScrollElement[0].offsetWidth;
                  var scrollWidth = ganttScrollElement[0].scrollWidth;
                  var rightScreenBorder = leftScreenBorder + screenWidth;
                  var keepOnScrolling = false;

                  if (mousePos.x < moveStartX) {
                    // Scroll to the left
                    if (
                      leftScreenBorder > 0 &&
                      mousePos.x <= leftScreenBorder + scrollTriggerDistance
                    ) {
                      mousePos.x -= scrollSpeed;
                      keepOnScrolling = true;
                      taskScope.row.rowsManager.gantt.api.scroll.left(
                        scrollSpeed
                      );
                    }
                  } else {
                    // Scroll to the right
                    if (
                      rightScreenBorder < scrollWidth &&
                      mousePos.x >= rightScreenBorder - scrollTriggerDistance
                    ) {
                      mousePos.x += scrollSpeed;
                      keepOnScrolling = true;
                      taskScope.row.rowsManager.gantt.api.scroll.right(
                        scrollSpeed
                      );
                    }
                  }

                  if (keepOnScrolling) {
                    scrollInterval = $timeout(
                      function () {
                        handleMove(mode, evt);
                      },
                      100,
                      true
                    );
                  }
                };

                var clearScrollInterval = function () {
                  if (scrollInterval !== undefined) {
                    $timeout.cancel(scrollInterval);
                    scrollInterval = undefined;
                  }
                };

                var getMoveMode = function (x) {
                  var distance = 0;

                  var allowResizing = utils.firstProperty(
                    [
                      taskScope.task.model.movable,
                      taskScope.task.row.model.movable,
                    ],
                    "allowResizing",
                    scope.allowResizing
                  );
                  var allowRowSwitching = utils.firstProperty(
                    [
                      taskScope.task.model.movable,
                      taskScope.task.row.model.movable,
                    ],
                    "allowRowSwitching",
                    scope.allowRowSwitching
                  );
                  var allowMoving = utils.firstProperty(
                    [
                      taskScope.task.model.movable,
                      taskScope.task.row.model.movable,
                    ],
                    "allowMoving",
                    scope.allowMoving
                  );

                  // Define resize&move area. Make sure the move area does not get too small.
                  if (allowResizing) {
                    distance =
                      taskElement[0].offsetWidth < 10
                        ? resizeAreaWidthSmall
                        : resizeAreaWidthBig;
                  }

                  if (
                    allowResizing &&
                    x > taskElement[0].offsetWidth - distance
                  ) {
                    return "E";
                  } else if (allowResizing && x < distance) {
                    return "W";
                  } else if (
                    (allowMoving || allowRowSwitching) &&
                    x >= distance &&
                    x <= taskElement[0].offsetWidth - distance
                  ) {
                    return "M";
                  } else {
                    return "";
                  }
                };

                var getCursor = function (mode) {
                  switch (mode) {
                    case "E":
                      return "e-resize";
                    case "W":
                      return "w-resize";
                    case "M":
                      return "move";
                  }
                };

                var enableMoveMode = function (mode, x) {
                  // Clone taskModel
                  if (taskScope.task.originalModel === undefined) {
                    taskScope.task.originalRow = taskScope.task.row;
                    taskScope.task.originalModel = taskScope.task.model;
                    taskScope.task.model = angular.copy(
                      taskScope.task.originalModel
                    );
                  }

                  if (mode === "M") {
                    taskElement.addClass("gantt-task-moving");
                    if (!taskScope.task.isMoving) {
                      taskScope.row.rowsManager.gantt.api.tasks.raise.moveBegin(
                        taskScope.task
                      );
                    }
                  } else {
                    taskElement.addClass("gantt-task-resizing");
                    if (!taskScope.task.isMoving) {
                      taskScope.row.rowsManager.gantt.api.tasks.raise.resizeBegin(
                        taskScope.task
                      );
                    }
                  }

                  // Init mouse start variables (if tasks was not move from another row)
                  if (!taskScope.task.isMoving) {
                    moveStartX = x;
                    mouseStartOffsetX = x - taskScope.task.modelLeft;
                  }

                  // Init task move
                  taskHasBeenChanged = false;
                  taskScope.task.moveMode = mode;
                  taskScope.task.isMoving = true;
                  taskScope.task.active = true;

                  // Add move event handlers
                  var taskMoveHandler = function (evt) {
                    evt.stopImmediatePropagation();
                    if (_hasTouch) {
                      evt = mouseOffset.getTouch(evt);
                    }
                    if (taskScope.task.isMoving) {
                      // As this function is defered, disableMoveMode may have been called before.
                      // Without this check, task.changed event is not fired for faster moves.
                      // See github issue #190
                      clearScrollInterval();
                      handleMove(mode, evt);
                    }
                  };
                  var moveSmartEvent = smartEvent(
                    taskScope,
                    windowElement,
                    _moveEvents,
                    taskMoveHandler
                  );
                  moveSmartEvent.bind();

                  smartEvent(
                    taskScope,
                    windowElement,
                    _releaseEvents,
                    function (evt) {
                      if (_hasTouch) {
                        evt = mouseOffset.getTouch(evt);
                      }
                      moveSmartEvent.unbind();
                      disableMoveMode(evt);
                      taskScope.$digest();
                    }
                  ).bindOnce();

                  // Show mouse move/resize cursor
                  taskElement.css("cursor", getCursor(mode));
                  angular.element($document[0].body).css({
                    "-moz-user-select": "-moz-none",
                    "-webkit-user-select": "none",
                    "-ms-user-select": "none",
                    "user-select": "none",
                    cursor: getCursor(mode),
                  });
                };

                var disableMoveMode = function () {
                  taskElement.removeClass("gantt-task-moving");
                  taskElement.removeClass("gantt-task-resizing");

                  if (taskScope.task.originalModel !== undefined) {
                    angular.extend(
                      taskScope.task.originalModel,
                      taskScope.task.model
                    );
                    taskScope.task.model = taskScope.task.originalModel;
                    if (
                      taskScope.task.row.model.id !==
                      taskScope.task.originalRow.model.id
                    ) {
                      var targetRow = taskScope.task.row;
                      targetRow.removeTask(
                        taskScope.task.model.id,
                        false,
                        true
                      );
                      taskScope.task.row = taskScope.task.originalRow;
                      targetRow.moveTaskToRow(taskScope.task, false);
                    }
                    delete taskScope.task.originalModel;
                    delete taskScope.task.originalRow;

                    taskScope.$apply();
                  }

                  taskScope.task.isMoving = false;
                  taskScope.task.active = false;

                  // Stop any active auto scroll
                  clearScrollInterval();

                  // Set mouse cursor back to default
                  taskElement.css("cursor", "");
                  angular.element($document[0].body).css({
                    "-moz-user-select": "",
                    "-webkit-user-select": "",
                    "-ms-user-select": "",
                    "user-select": "",
                    cursor: "",
                  });

                  // Raise move end event
                  if (taskScope.task.moveMode === "M") {
                    taskScope.row.rowsManager.gantt.api.tasks.raise.moveEnd(
                      taskScope.task
                    );
                  } else {
                    taskScope.row.rowsManager.gantt.api.tasks.raise.resizeEnd(
                      taskScope.task
                    );
                  }

                  taskScope.task.moveMode = undefined;

                  // Raise task changed event
                  if (taskHasBeenChanged === true) {
                    taskHasBeenChanged = false;
                    taskScope.task.row.sortTasks(); // Sort tasks so they have the right z-order
                    taskScope.row.rowsManager.gantt.api.tasks.raise.change(
                      taskScope.task
                    );
                  }
                };

                if (taskScope.task.isResizing) {
                  delete taskScope.task.isResizing;
                  enableMoveMode("E", taskScope.task.mouseOffsetX);
                } else if (taskScope.task.isMoving) {
                  // In case the task has been moved to another row a new controller is is created by angular.
                  // Enable the move mode again if this was the case.
                  enableMoveMode("M", taskScope.task.mouseOffsetX);
                }
              }
            }
          );
        },
      };
    },
  ]);
})();

(function () {
  "use strict";
  angular
    .module("gantt.progress", ["gantt", "gantt.progress.templates"])
    .directive("ganttProgress", [
      "moment",
      "$compile",
      "$document",
      function (moment, $compile, $document) {
        return {
          restrict: "E",
          require: "^gantt",
          scope: {
            enabled: "=?",
          },
          link: function (scope, element, attrs, ganttCtrl) {
            var api = ganttCtrl.gantt.api;

            // Load options from global options attribute.
            if (scope.options && typeof scope.options.progress === "object") {
              for (var option in scope.options.progress) {
                scope[option] = scope.options[option];
              }
            }

            if (scope.enabled === undefined) {
              scope.enabled = true;
            }

            api.directives.on.new(
              scope,
              function (directiveName, taskScope, taskElement) {
                if (directiveName === "ganttTask") {
                  var progressScope = taskScope.$new();
                  progressScope.pluginScope = scope;

                  var ifElement = $document[0].createElement("div");
                  angular
                    .element(ifElement)
                    .attr(
                      "data-ng-if",
                      "task.model.progress !== undefined && pluginScope.enabled"
                    );

                  var progressElement = $document[0].createElement(
                    "gantt-task-progress"
                  );
                  if (attrs.templateUrl !== undefined) {
                    angular
                      .element(progressElement)
                      .attr("data-template-url", attrs.templateUrl);
                  }
                  if (attrs.template !== undefined) {
                    angular
                      .element(progressElement)
                      .attr("data-template", attrs.template);
                  }
                  angular.element(ifElement).append(progressElement);
                  taskElement.append($compile(ifElement)(progressScope));
                }
              }
            );

            api.tasks.on.clean(scope, function (model) {
              if (model.est !== undefined && !moment.isMoment(model.est)) {
                model.est = moment(model.est); //Earliest Start Time
              }

              if (model.lct !== undefined && !moment.isMoment(model.lct)) {
                model.lct = moment(model.lct); //Latest Completion Time
              }
            });
          },
        };
      },
    ]);
})();

(function () {
  "use strict";
  angular
    .module("gantt.sortable", ["gantt", "ang-drag-drop"])
    .directive("ganttSortable", [
      "ganttUtils",
      "$compile",
      function (utils, $compile) {
        // Provides the row sort functionality to any Gantt row
        // Uses the sortableState to share the current row

        return {
          restrict: "E",
          require: "^gantt",
          scope: {
            enabled: "=?",
          },
          link: function (scope, element, attrs, ganttCtrl) {
            var api = ganttCtrl.gantt.api;

            // Load options from global options attribute.
            if (scope.options && typeof scope.options.sortable === "object") {
              for (var option in scope.options.sortable) {
                scope[option] = scope.options[option];
              }
            }

            if (scope.enabled === undefined) {
              scope.enabled = true;
            }

            api.directives.on.new(
              scope,
              function (directiveName, rowScope, rowElement) {
                if (directiveName === "ganttRowLabel") {
                  rowScope.checkDraggable = function () {
                    return utils.firstProperty(
                      [rowScope.row.model.sortable],
                      "enabled",
                      scope.enabled
                    );
                  };

                  rowScope.onDropSuccess = function () {
                    rowScope.$evalAsync();
                  };

                  rowScope.onDrop = function (evt, data) {
                    var row = rowScope.row.rowsManager.rowsMap[data.id];
                    if (row !== rowScope) {
                      rowScope.row.rowsManager.moveRow(row, rowScope.row);
                      rowScope.$evalAsync();
                    }
                  };

                  rowElement.attr("ui-draggable", "{{checkDraggable()}}");
                  rowElement.attr("drag-channel", "'sortable'");
                  rowElement.attr("ui-on-drop", "onDrop($event, $data)");
                  rowElement.attr("on-drop-success", "onDropSuccess()");

                  rowElement.attr("drop-channel", "'sortable'");
                  rowElement.attr("drag", "row.model");

                  $compile(rowElement)(rowScope);
                }
              }
            );
          },
        };
      },
    ]);
})();

(function () {
  "use strict";
  angular
    .module("gantt.tooltips", ["gantt", "gantt.tooltips.templates"])
    .directive("ganttTooltips", [
      "$compile",
      "$document",
      function ($compile, $document) {
        return {
          restrict: "E",
          require: "^gantt",
          scope: {
            enabled: "=?",
            dateFormat: "=?",
          },
          link: function (scope, element, attrs, ganttCtrl) {
            var api = ganttCtrl.gantt.api;

            // Load options from global options attribute.
            if (scope.options && typeof scope.options.tooltips === "object") {
              for (var option in scope.options.tooltips) {
                scope[option] = scope.options[option];
              }
            }

            if (scope.enabled === undefined) {
              scope.enabled = true;
            }
            if (scope.dateFormat === undefined) {
              scope.dateFormat = "MMM DD, HH:mm";
            }

            scope.api = api;

            api.directives.on.new(
              scope,
              function (directiveName, taskScope, taskElement) {
                if (directiveName === "ganttTask") {
                  var tooltipScope = taskScope.$new();

                  tooltipScope.pluginScope = scope;
                  var ifElement = $document[0].createElement("div");
                  angular
                    .element(ifElement)
                    .attr("data-ng-if", "pluginScope.enabled");

                  var tooltipElement =
                    $document[0].createElement("gantt-tooltip");
                  if (attrs.templateUrl !== undefined) {
                    angular
                      .element(tooltipElement)
                      .attr("data-template-url", attrs.templateUrl);
                  }
                  if (attrs.template !== undefined) {
                    angular
                      .element(tooltipElement)
                      .attr("data-template", attrs.template);
                  }

                  angular.element(ifElement).append(tooltipElement);
                  taskElement.append($compile(ifElement)(tooltipScope));
                }
              }
            );
          },
        };
      },
    ]);
})();

(function () {
  "use strict";
  angular.module("gantt.bounds").directive("ganttTaskBounds", [
    "$templateCache",
    "moment",
    function ($templateCache, moment) {
      // Displays a box representing the earliest allowable start time and latest completion time for a job

      return {
        restrict: "E",
        templateUrl: function (tElement, tAttrs) {
          var templateUrl;
          if (tAttrs.templateUrl === undefined) {
            templateUrl = "plugins/bounds/taskBounds.tmpl.html";
          } else {
            templateUrl = tAttrs.templateUrl;
          }
          if (tAttrs.template) {
            $templateCache.put(templateUrl, tAttrs.template);
          }
          return templateUrl;
        },
        replace: true,
        scope: true,
        controller: [
          "$scope",
          "$element",
          function ($scope, $element) {
            $element.toggleClass("ng-hide", true);

            $scope.simplifyMoment = function (d) {
              return moment.isMoment(d) ? d.unix() : d;
            };

            $scope.$watchGroup(
              [
                "simplifyMoment(task.model.est)",
                "simplifyMoment(task.model.lct)",
                "task.left",
                "task.width",
              ],
              function () {
                var left = $scope.task.rowsManager.gantt.getPositionByDate(
                  $scope.task.model.est
                );
                var right = $scope.task.rowsManager.gantt.getPositionByDate(
                  $scope.task.model.lct
                );

                $element.css("left", left - $scope.task.left + "px");
                $element.css("width", right - left + "px");

                $element.toggleClass("gantt-task-bounds-in", false);
                $element.toggleClass("gantt-task-bounds-out", false);
                if (
                  $scope.task.model.est === undefined ||
                  $scope.task.model.lct === undefined
                ) {
                  $element.toggleClass("gantt-task-bounds-in", true);
                } else if ($scope.task.model.est > $scope.task.model.from) {
                  $element.toggleClass("gantt-task-bounds-out", true);
                } else if ($scope.task.model.lct < $scope.task.model.to) {
                  $element.toggleClass("gantt-task-bounds-out", true);
                } else {
                  $element.toggleClass("gantt-task-bounds-in", true);
                }
              }
            );

            $scope.task.$element.bind("mouseenter", function () {
              $element.toggleClass("ng-hide", false);
            });

            $scope.task.$element.bind("mouseleave", function () {
              $element.toggleClass("ng-hide", true);
            });

            $scope.task.rowsManager.gantt.api.directives.raise.new(
              "ganttBounds",
              $scope,
              $element
            );
            $scope.$on("$destroy", function () {
              $scope.task.rowsManager.gantt.api.directives.raise.destroy(
                "ganttBounds",
                $scope,
                $element
              );
            });
          },
        ],
      };
    },
  ]);
})();

(function () {
  "use strict";
  angular.module("gantt.movable").factory("ganttMovableOptions", [
    function () {
      return {
        initialize: function (options) {
          options.enabled =
            options.enabled !== undefined ? !!options.enabled : true;
          options.allowMoving =
            options.allowMoving !== undefined ? !!options.allowMoving : true;
          options.allowResizing =
            options.allowResizing !== undefined
              ? !!options.allowResizing
              : true;
          options.allowRowSwitching =
            options.allowRowSwitching !== undefined
              ? !!options.allowRowSwitching
              : true;

          return options;
        },
      };
    },
  ]);
})();

(function () {
  "use strict";
  angular.module("gantt.progress").directive("ganttTaskProgress", [
    "$templateCache",
    function ($templateCache) {
      return {
        restrict: "E",
        requires: "^ganttTask",
        templateUrl: function (tElement, tAttrs) {
          var templateUrl;
          if (tAttrs.templateUrl === undefined) {
            templateUrl = "plugins/progress/taskProgress.tmpl.html";
          } else {
            templateUrl = tAttrs.templateUrl;
          }
          if (tAttrs.template !== undefined) {
            $templateCache.put(templateUrl, tAttrs.template);
          }
          return templateUrl;
        },
        replace: true,
        scope: true,
        controller: [
          "$scope",
          "$element",
          function ($scope, $element) {
            $scope.getClasses = function () {
              var classes = [];

              if (typeof $scope.task.model.progress === "object") {
                classes = $scope.task.model.progress.classes;
              }

              return classes;
            };

            $scope.getCss = function () {
              var css = {};

              var progress;
              if ($scope.task.model.progress !== undefined) {
                if (typeof $scope.task.model.progress === "object") {
                  progress = $scope.task.model.progress;
                } else {
                  progress = { percent: $scope.task.model.progress };
                }
              }

              if (progress) {
                if (progress.color) {
                  css["background-color"] = progress.color;
                } else {
                  css["background-color"] = "#6BC443";
                }

                css.width = progress.percent + "%";
              }

              return css;
            };

            $scope.task.rowsManager.gantt.api.directives.raise.new(
              "ganttTaskProgress",
              $scope,
              $element
            );
            $scope.$on("$destroy", function () {
              $scope.task.rowsManager.gantt.api.directives.raise.destroy(
                "ganttTaskProgress",
                $scope,
                $element
              );
            });
          },
        ],
      };
    },
  ]);
})();

(function () {
  "use strict";
  angular.module("gantt.tooltips").directive("ganttTooltip", [
    "$timeout",
    "$compile",
    "$document",
    "$templateCache",
    "ganttDebounce",
    "ganttSmartEvent",
    function (
      $timeout,
      $compile,
      $document,
      $templateCache,
      debounce,
      smartEvent
    ) {
      // This tooltip displays more information about a task

      return {
        restrict: "E",
        templateUrl: function (tElement, tAttrs) {
          var templateUrl;
          if (tAttrs.templateUrl === undefined) {
            templateUrl = "plugins/tooltips/tooltip.tmpl.html";
          } else {
            templateUrl = tAttrs.templateUrl;
          }
          if (tAttrs.template !== undefined) {
            $templateCache.put(templateUrl, tAttrs.template);
          }
          return templateUrl;
        },
        scope: true,
        replace: true,
        controller: [
          "$scope",
          "$element",
          "ganttUtils",
          function ($scope, $element, utils) {
            var bodyElement = angular.element($document[0].body);
            var parentElement = $scope.task.$element;
            var showTooltipPromise;
            var mousePositionX;

            $element.toggleClass("ng-hide", true);

            $scope.getFromLabel = function () {
              var dateFormat = utils.firstProperty(
                [$scope.task.model.tooltips, $scope.task.row.model.tooltips],
                "dateFormat",
                $scope.pluginScope.dateFormat
              );
              return $scope.task.model.from.format(dateFormat);
            };

            $scope.getToLabel = function () {
              var dateFormat = utils.firstProperty(
                [$scope.task.model.tooltips, $scope.task.row.model.tooltips],
                "dateFormat",
                $scope.pluginScope.dateFormat
              );
              return $scope.task.model.to.format(dateFormat);
            };

            var displayTooltip = function (newValue) {
              if (showTooltipPromise) {
                $timeout.cancel(showTooltipPromise);
              }
              var enabled = utils.firstProperty(
                [$scope.task.model.tooltips, $scope.task.row.model.tooltips],
                "enabled",
                $scope.pluginScope.enabled
              );
              if (enabled && newValue === true) {
                showTooltipPromise = $timeout(
                  function () {
                    showTooltip(mousePositionX);
                  },
                  500,
                  true
                );
              } else {
                if (!$scope.task.active) {
                  hideTooltip();
                }
              }
            };

            $scope.task.$element.bind("mousemove", function (evt) {
              mousePositionX = evt.clientX;
            });

            $scope.task.$element.bind("mouseenter", function (evt) {
              $scope.mouseEnterX = evt.clientX;
              displayTooltip(true);
              $scope.$digest();
            });

            $scope.task.$element.bind("mouseleave", function () {
              $scope.mouseEnterX = undefined;
              displayTooltip(false);
              $scope.$digest();
            });

            if ($scope.pluginScope.api.tasks.on.moveBegin) {
              var mouseMoveHandler = smartEvent(
                $scope,
                bodyElement,
                "mousemove",
                debounce(
                  function (e) {
                    updateTooltip(e.clientX);
                  },
                  5,
                  false
                )
              );

              $scope.pluginScope.api.tasks.on.moveBegin(
                $scope,
                function (task) {
                  if (task === $scope.task) {
                    mouseMoveHandler.bind();
                  }
                }
              );

              $scope.pluginScope.api.tasks.on.moveEnd($scope, function (task) {
                if (task === $scope.task) {
                  mouseMoveHandler.unbind();
                }
              });

              $scope.pluginScope.api.tasks.on.resizeBegin(
                $scope,
                function (task) {
                  if (task === $scope.task) {
                    mouseMoveHandler.bind();
                  }
                }
              );

              $scope.pluginScope.api.tasks.on.resizeEnd(
                $scope,
                function (task) {
                  if (task === $scope.task) {
                    mouseMoveHandler.unbind();
                  }
                }
              );
            }

            var getViewPortWidth = function () {
              var d = $document[0];
              return (
                d.documentElement.clientWidth ||
                d.documentElement.getElementById("body")[0].clientWidth
              );
            };

            var showTooltip = function (x) {
              $element.toggleClass("ng-hide", false);

              $timeout(
                function () {
                  updateTooltip(x);

                  $element.css(
                    "top",
                    parentElement[0].getBoundingClientRect().top + "px"
                  );
                  $element.css(
                    "marginTop",
                    -$element[0].offsetHeight - 8 + "px"
                  );
                  $element.css("opacity", 1);
                },
                0,
                true
              );
            };

            var updateTooltip = function (x) {
              // Check if info is overlapping with view port
              if (x + $element[0].offsetWidth > getViewPortWidth()) {
                $element.css("left", x + 20 - $element[0].offsetWidth + "px");
                $element.addClass("gantt-task-infoArrowR"); // Right aligned info
                $element.removeClass("gantt-task-infoArrow");
              } else {
                $element.css("left", x - 20 + "px");
                $element.addClass("gantt-task-infoArrow");
                $element.removeClass("gantt-task-infoArrowR");
              }
            };

            var hideTooltip = function () {
              $element.css("opacity", 0);
              $element.toggleClass("ng-hide", true);
            };

            $scope.gantt.api.directives.raise.new(
              "ganttTooltip",
              $scope,
              $element
            );
            $scope.$on("$destroy", function () {
              $scope.gantt.api.directives.raise.destroy(
                "ganttTooltip",
                $scope,
                $element
              );
            });
          },
        ],
      };
    },
  ]);
})();

//# sourceMappingURL=angular-gantt-plugins.js.map
