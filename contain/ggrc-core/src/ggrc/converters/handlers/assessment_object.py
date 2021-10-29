# Copyright (C) 2016 Google Inc.
# Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>

"""Handlers for special object mappings."""


from ggrc.converters.handlers import multi_object
from ggrc.converters.handlers import handlers


class AssessmentObjectColumnHandler(handlers.MappingColumnHandler,
                                    multi_object.ObjectsColumnHandler):

  """Handler for Assessment object column."""

  def __init__(self, row_converter, key, **options):
    handlers.MappingColumnHandler.__init__(self, row_converter, key, **options)
    multi_object.ObjectsColumnHandler.__init__(
        self, row_converter, key, **options)

  def parse_item(self):
    return multi_object.ObjectsColumnHandler.parse_item(self)
