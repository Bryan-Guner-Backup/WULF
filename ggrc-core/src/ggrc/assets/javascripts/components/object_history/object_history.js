/*!
  Copyright (C) 2016 Google Inc.
  Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
*/

(function (GGRC, can) {
  'use strict';

  /**
   * A component that calculates and renders the given Model object's revision
   * history.
   */
  GGRC.Components('objectHistory', {
    tag: 'revision-log',

    template: can.view(
      GGRC.mustache_path +
      '/components/object_history/object_history.mustache'
    ),

    scope: {
      instance: null,
      changeHistory: [],
      isLoading: true
    },

    _DATE_FIELDS: Object.freeze({
      created_at: 1,
      updated_at: 1,
      start_date: 1,
      end_date: 1,
      requested_on: 1,
      due_on: 1,
      finished_date: 1,
      verified_date: 1
    }),

    _LIST_FIELDS: Object.freeze({
      recipients: 1
    }),

    _EMBED_MAPPINGS: Object.freeze({
      Request: ['Comment', 'Document'],
      Assessment: ['Comment', 'Document']
    }),

    /**
     * The component's entry point. Invoked when a new component instance has
     * been created.
     *
     * @param {Object} element - the (unwrapped) DOM element that triggered
     *   creating the component instance
     * @param {Object} options - the component instantiation options
     */
    init: function (element, options) {
      var setUp = function () {
        this._fetchRevisionsData(
          this.scope.instance
        ).then(
          function success(revisions) {
            var changeHistory;

            // calculate history of role changes
            this.roleHistory = this._computeRoleChanges(revisions);

            // combine all the changes and sort them by date descending
            changeHistory = _([]).concat(
                _.toArray(this._computeObjectChanges(revisions.object)),
                _.toArray(this._computeMappingChanges(revisions.mappings))
            ).sortBy('updatedAt').reverse().value();
            this.scope.attr('changeHistory', changeHistory);
          }.bind(this),

          function error() {
            $(element).trigger(
              'ajax:flash',
              {error: 'Failed to fetch revision history data.'});
          }
        ).always(function () {
          this.scope.attr('isLoading', false);
        }.bind(this));
      }.bind(this);

      if (this.scope.instance === null) {
        throw new Error('Instance not passed through the HTML element.');
      }
      this.scope.instance.on('updated', function () {
        setUp();
      });
      setUp();
    },

    /**
     * Fetch the instance's Revisions data from the server, including the
     * Revisions of the instance's mappings.
     *
     * The `instance` here refers to the instance of an object currently being
     * handled by the component.
     *
     * @return {can.Deferred} - an object representing the async operation of
     *   fetching the data from the server. On success it is resolved with an
     *   object containing the following Revision data, order by date from
     *   oldest to newest:
     *   - {Array} object - the list of Revisions of the instance itself,
     *   - {Array} mappings - the list of Revisions of all the instance's
     *      mappings
     */
    _fetchRevisionsData: function () {
      var findAll = function (attr) {
        var query = {__sort: 'updated_at'};
        query[attr + '_type'] = this.scope.instance.type;
        query[attr + '_id'] = this.scope.instance.id;
        return CMS.Models.Revision.findAll(query);
      }.bind(this);

      return can.when(
        findAll('resource'), findAll('source'), findAll('destination')
      ).then(function (objRevisions, mappingsSrc, mappingsDest) {
        // manually include people for modified_by since using __include would
        // result in a lot of duplication
        var rq = new RefreshQueue();
        _.each(objRevisions.concat(mappingsSrc, mappingsDest),
            function (revision) {
              if (revision.modified_by) {
                rq.enqueue(revision.modified_by);
              }
            });
        _.each(mappingsSrc, function (revision) {
          if (revision.destination_type && revision.destination_id) {
            revision.destination = can.Stub.get_or_create({
              id: revision.destination_id,
              type: revision.destination_type
            });
            rq.enqueue(revision.destination);
          }
        });
        _.each(mappingsDest, function (revision) {
          if (revision.source_type && revision.source_id) {
            revision.source = can.Stub.get_or_create({
              id: revision.source_id,
              type: revision.source_type
            });
            rq.enqueue(revision.source);
          }
        });
        return this._fetchEmbeddedRevisionData(rq.objects, rq)
          .then(function (embedded) {
            return rq.trigger().then(function () {
              var reify = function (revision) {
                _.each(['modified_by', 'source', 'destination'],
                    function (field) {
                      if (revision[field] && revision[field].reify) {
                        revision.attr(field, revision[field].reify());
                      }
                    });
                return revision;
              };
              var mappings = mappingsSrc.concat(mappingsDest, embedded);
              return {
                object: _.map(objRevisions, reify),
                mappings: _.map(mappings, reify)
              };
            });
          });
      }.bind(this));
    },

    /**
     * Fetch revisions of indirect mappings ('Cross').
     *
     * @param {Array} mappedObjects - the list of object instances to fetch
     *   mappings to (objects mapped to the current instance).
     *
     * @param {RefreshQueue} rq - current refresh queue to use for fetching
     *   full objects.
     *
     * @return {Deferred} - A deferred that will resolve into a array of
     *   revisons of the indirect mappings.
     */
    _fetchEmbeddedRevisionData: function (mappedObjects, rq) {
      var filterElegible = function (obj) {
        return _.contains(this._EMBED_MAPPINGS[this.scope.instance.type],
                          obj.type);
      }.bind(this);
      var fetchRevisions = function (obj) {
        return [
          CMS.Models.Revision.findAll({
            source_type: obj.type,
            source_id: obj.id,
            __sort: 'updated_at'
          }).then(function (revisions) {
            return _.map(revisions, function (revision) {
              revision = new can.Map(revision.serialize());
              revision.attr({
                updated_at: new Date(revision.updated_at),
                source_type: this.scope.instance.type,
                source_id: this.scope.instance.id,
                source: this.scope.instance,
                destination: can.Stub.get_or_create({
                  type: revision.destination_type,
                  id: revision.destination_id
                })
              });
              rq.enqueue(revision.destination);
              return revision;
            }.bind(this));
          }.bind(this)),
          CMS.Models.Revision.findAll({
            destination_type: obj.type,
            destination_id: obj.id,
            __sort: 'updated_at'
          }).then(function (revisions) {
            return _.map(revisions, function (revision) {
              revision = new can.Map(revision.serialize());
              revision.attr({
                updated_at: new Date(revision.updated_at),
                destination_type: this.scope.instance.type,
                destination_id: this.scope.instance.id,
                destination: this.scope.instance,
                source: can.Stub.get_or_create({
                  type: revision.source_type,
                  id: revision.source_id
                })
              });
              rq.enqueue(revision.source);
              return revision;
            }.bind(this));
          }.bind(this))
        ];
      }.bind(this);
      var dfds = _.chain(mappedObjects).filter(filterElegible)
                                       .map(fetchRevisions)
                                       .flatten()
                                       .value();
      return $.when.apply($, dfds).then(function () {
        return _.filter(_.flatten(arguments), function (revision) {
          // revisions where source == destination will be introduced when
          // spoofing the obj <-> instance mapping
          return revision.source.href !== revision.destination.href;
        });
      });
    },

    /**
     * Compute the the history of object changes from a list of Revisions.
     *
     * The computed list of changes is sorted from oldest to newest (the method
     * assumes that the `revisions` list is also sorted chronologically with
     * the oldest Revision placed first).
     *
     *
     * @param {Array} revisions - the list of revisions of the instance
     *   being handled by the component, sorted from oldest to newest.
     *
     * @return {Array} - the history of changes to the instance. Each
     *   element follows the format returned by the `_objectChangeDiff` method.
     */
    _computeObjectChanges: function (revisions) {
      var diffList = _.map(revisions, function (revision, i) {
        // default to empty revision
        var prev = revisions[i - 1] || {content: {}};
        return this._objectChangeDiff(prev, revision);
      }.bind(this));
      return _.filter(diffList, 'changes.length');
    },

    /**
     * A helper function for computing the difference between the two Revisions
     * of an object.
     *
     * The function assumes that the given revisions are two distinct Revisions
     * of the same object (application entity).
     *
     * NOTE: The object fields that do not have a user-friendly alias defined are
     * considered 'internal', and are thus not included in the resulting diff
     * objects, because they are not meant to be shown to the end user.
     *
     * @param {CMS.Models.Revision} rev1 - the older of the two revisions
     * @param {CMS.Models.Revision} rev2 - the newer of the two revisions
     *
     * @return {Object} - A 'diff' object describing the changes between the
     *   revisions. The object has the following attributes:
     *   - madeBy: the user who made the changes
     *   - updatedAt: the time when the changes have been made
     *   - role: highest role at the time of change
     *   - changes:
     *       A list of objects describing the modified attributes of the
     *       instance`, with each object having the following attributes:
     *         - fieldName: the name of the changed`instance` attribute
     *         - origVal: the attribute's original value
     *         - newVal: the attribute's new (modified) value
     */
    _objectChangeDiff: function (rev1, rev2) {
      var diff = {
        madeBy: null,
        updatedAt: null,
        changes: []
      };
      var attrDefs = GGRC.model_attr_defs[rev2.resource_type];

      diff.madeBy = rev2.modified_by;
      diff.updatedAt = rev2.updated_at;
      diff.role = this._getRoleAtTime(rev2.modified_by.id, rev2.updated_at);

      can.each(rev2.content, function (value, fieldName) {
        var origVal = rev1.content[fieldName];
        var displayName;
        if (attrDefs) {
          displayName = (_.find(attrDefs, function (attr) {
            return attr.attr_name === fieldName;
          }) || {}).display_name;
        } else {
          displayName = fieldName;
        }

        if (displayName && value !== origVal) {
          // format date fields
          if (this._DATE_FIELDS[fieldName]) {
            if (value) {
              value = GGRC.Utils.formatDate(value, true);
            }
            if (origVal) {
              origVal = GGRC.Utils.formatDate(origVal, true);
            }
          }
          if (this._LIST_FIELDS[fieldName]) {
            if (value) {
              value = _(value).splitTrim(',').compact().join(', ');
            }
            if (origVal) {
              origVal = _(origVal).splitTrim(',').compact().join(', ');
            }
          }
          if (origVal || value) {
            diff.changes.push({
              fieldName: displayName,
              origVal: origVal || '???',
              newVal: value || '???'
            });
          }
        }
      }.bind(this));
      diff.changes = diff.changes.concat(
          this._objectCADiff(
            rev1.content.custom_attributes,
            rev1.content.custom_attribute_definitions,
            rev2.content.custom_attributes,
            rev2.content.custom_attribute_definitions));
      return diff;
    },

    _objectCADiff: function (origValues, origDefs, newValues, newDefs) {
      var ids;
      var defs;
      var showValue = function (value, def) {
        var obj;
        switch (def.attribute_type) {
          case 'Checkbox':
            return value.attribute_value ? '???' : undefined;
          case 'Map:Person':
            obj = CMS.Models.Person.findInCacheById(value.attribute_object_id);
            if (obj === undefined) {
              return value.attribute_value;
            }
            return obj.name || obj.email || value.attribute_value;
          default:
            return value.attribute_value;
        }
      };

      origValues = _.indexBy(origValues, 'custom_attribute_id');
      origDefs = _.indexBy(origDefs, 'id');
      newValues = _.indexBy(newValues, 'custom_attribute_id');
      newDefs = _.indexBy(newDefs, 'id');

      ids = _.unique(_.keys(origValues).concat(_.keys(newValues)));
      defs = _.merge(origDefs, newDefs);

      return _.chain(ids).map(function (id) {
        var def = defs[id];
        var diff = {
          fieldName: def.title,
          origVal: showValue(origValues[id] || {}, def) || '???',
          newVal: showValue(newValues[id] || {}, def) || '???'
        };
        if (diff.origVal === diff.newVal) {
          return undefined;
        }
        return diff;
      }).filter().value();
    },

    /**
     * Compute the instance's object mapping-related changes from the list of
     * mapping revisions.
     *
     * @param {Array} revisions - the list of instance mappings' revision
     *   history, sorted from oldest to newest.
     *
     * @return {Array} - the history of instance mappings' changes. Each
     *   element follows the format returned by the `_mappingChange` helper
     *   method.
     */
    _computeMappingChanges: function (revisions) {
      var chains = _.chain(revisions)
                    .groupBy('resource_id')
                    .mapValues(function (chain) {
                      return _.sortBy(chain, 'updated_at');
                    }).value();
      return _.map(revisions, function (revision) {
        return this._mappingChange(revision, chains[revision.resource_id]);
      }.bind(this));
    },

    /**
     * A helper function for extracting the mapping change information from a
     * Revision object.
     *
     * @param {CMS.Models.Revision} revision - a Revision object describing a
     *   mapping between the object instance the component is handling, and an
     *   external object
     *
     * @param {Array} chain - revisions of the same resource ordered
     *   chronologically
     *
     * @return {Object} - A 'change' object describing a single modification
     *   of a mapping. The object has the following attributes:
     *   - madeBy: the user who made the changes
     *   - updatedAt: the time when the changes have been made
     *   - role: highest role at the time of change
     *   - changes:
     *       A list of objects describing the modified attributes of the
     *       instance`, with each object having the following attributes:
     *         - fieldName: the name of the changed`instance` attribute
     *         - origVal: the attribute's original value
     *         - newVal: the attribute's new (modified) value
     */
    _mappingChange: function (revision, chain) {
      var object;
      var displayName;
      var displayType;
      var fieldName;
      var origVal;
      var newVal;
      var previous;

      if (revision.destination_type === this.scope.instance.type &&
        revision.destination_id === this.scope.instance.id) {
        object = revision.source;
      } else {
        object = revision.destination;
      }

      if (object instanceof can.Stub) {
        object = object.reify();
      }

      displayName = object.display_name() || object.description;
      displayType = object.display_type() || object.type;

      fieldName = 'Mapping to ' + displayType + ': ' + displayName;
      origVal = '???';
      newVal = _.capitalize(revision.action);
      previous = chain[_.findIndex(chain, revision) - 1];
      if (revision.action !== 'deleted' &&
          _.exists(revision.content, 'attrs.AssigneeType')) {
        newVal = revision.content.attrs.AssigneeType;
      }
      if (_.exists(previous, 'content.attrs.AssigneeType')) {
        origVal = previous.content.attrs.AssigneeType;
      } else if (revision.action === 'deleted') {
        origVal = 'Created';
      }
      return {
        madeBy: revision.modified_by,
        updatedAt: revision.updated_at,
        role: this._getRoleAtTime(
          revision.modified_by.id, revision.updated_at),
        changes: {
          origVal: origVal,
          newVal: newVal,
          fieldName: fieldName
        }
      };
    },
    /**
     * Calculate each person's role history.
     *
     * It groups together all people mapping changes and for each change
     * gets the highest role at the time of change.
     *
     * If however the revision history isn't complete (they don't start with
     * "created" action, e.g. old assessments) it then adds "no role" to the
     * start of person's history.
     *
     * If we don't have any revisions to person mappings but they are
     * currently an assignee, we select the highest current role.
     *
     * If user has no role and was not or is not an assignee, we just add a
     * single role change ("no role").
     *
     * @param {CMS.Models.Revision} revision - a Revision object describing a
     *   mapping between the object instance the component is handling, and an
     *   external object
     *
     * @return {Object} - An object containing user IDs as keys and person's
     *   role history through time ordered in increasing order.
     */

    _computeRoleChanges: function (revisions) {
      var mappings = _.sortBy(revisions.mappings, 'updated_at');
      var instance = this.scope.instance;
      var assigneeList = instance.class.assignable_list;
      var perPersonMappings;
      var perPersonRoleHistory;
      var modifiers;
      var currentAssignees;
      var assigneeRoles;
      var unmodifiedAssignees;
      var unassignedPeople;

      perPersonMappings = _(mappings)
        .filter(function (rev) {
          if (rev.source_type === 'Person' || rev.destination_type === 'Person') {
            return rev;
          }
        })
        .groupBy(function (rev) {
          if (rev.source_type === 'Person') {
            return rev.source_id;
          }
          return rev.destination_id;
        }).value();

      perPersonRoleHistory = _.zipObject(
        _.map(perPersonMappings, function (revisions, pid) {
          var history = _.map(revisions, function (rev) {
            if (rev.action === 'deleted') {
              return {
                updated_at: rev.updated_at,
                role: 'none'
              };
            }
            return {
              updated_at: rev.updated_at,
              role: GGRC.Utils.get_highest_assignee_role(
                instance,
                rev.content.attrs.AssigneeType.split(','))
            };
          });

          if (revisions[0].action !== 'created') {
            history.unshift({
              role: 'none',
              updated_at: instance.created_at
            });
          }
          return [pid, history];
        }));

      modifiers = _.unique(
        _.map(
          _.union(
            revisions.object,
            revisions.mappings),
          'modified_by.id')).map(String);

      currentAssignees = _.groupBy(
        _.flattenDeep(_.map(assigneeList, function (assignableType) {
          return _.map(instance.get_binding(assignableType.mapping).list,
            function (person) {
              return {
                id: person.instance.id,
                type: assignableType.type
              };
            });
        })), 'id');

      assigneeRoles = _.zipObject(
        _.map(currentAssignees, function (rolePeople, pid) {
          return [pid, _.map(rolePeople, 'type')];
        }));

      unmodifiedAssignees = _.difference(
        _.keys(assigneeRoles), _.keys(perPersonRoleHistory));

      _.forEach(unmodifiedAssignees, function (pid) {
        var existingRoles = assigneeRoles[pid];
        var role = GGRC.Utils.get_highest_assignee_role(
          instance, existingRoles);
        perPersonRoleHistory[pid] = [{
          updated_at: instance.created_at,
          role: role
        }];
      });

      unassignedPeople = _.difference(
        modifiers, _.keys(perPersonRoleHistory));

      _.forEach(unassignedPeople, function (pid) {
        perPersonRoleHistory[pid] = [{
          updated_at: instance.created_at,
          role: 'none'
        }];
      });

      return perPersonRoleHistory;
    },
    /**
     * A function to return person's highest role at a certain time
     *
     * @param {String|Number} personId - Person ID
     * @param {Date} timePoint - Time of change
     * @return {String} - Lowercase role string
     */
    _getRoleAtTime: function (personId, timePoint) {
      var personHistory = this.roleHistory[personId] || [];
      var role = _.last(_.takeWhile(personHistory, function (roleChange) {
        return roleChange.updated_at <= timePoint;
      }));
      if (role) {
        return role.role;
      }
      return 'none';
    }
  });
})(window.GGRC, window.can);
