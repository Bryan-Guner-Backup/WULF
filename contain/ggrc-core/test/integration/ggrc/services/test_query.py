# Copyright (C) 2016 Google Inc.
# Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>

"""Tests for /query api endpoint."""

from datetime import datetime
from operator import itemgetter
from os.path import abspath, dirname, join
from flask import json
from nose.plugins.skip import SkipTest

from integration.ggrc.converters import TestCase


THIS_ABS_PATH = abspath(dirname(__file__))
CSV_DIR = join(THIS_ABS_PATH, "../converters/test_csvs/")

# to be moved into converters.query_helper
DATE_FORMAT_REQUEST = "%m/%d/%Y"
DATE_FORMAT_RESPONSE = "%Y-%m-%d"


class TestAdvancedQueryAPI(TestCase):
  """Basic tests for /query api."""

  @classmethod
  def setUpClass(cls):
    """Set up test cases for all tests."""
    TestCase.clear_data()
    # This imported file could be simplified a bit to speed up testing.
    cls._import_file("data_for_export_testing.csv")

  def setUp(self):
    self.client.get("/login")

  def _post(self, data):
    """Make a POST to /query endpoint."""
    if not isinstance(data, list):
      data = [data]
    headers = {"Content-Type": "application/json", }
    return self.client.post("/query", data=json.dumps(data), headers=headers)

  def _get_first_result_set(self, data, *keys):
    """Post data, get response, get values from it like in obj["a"]["b"]."""
    result = json.loads(self._post(data).data)[0]
    for key in keys:
      result = result.get(key)
      self.assertIsNot(result, None)
    return result

  def test_basic_query_eq(self):
    """Filter by = operator."""
    title = "Cat ipsum 1"
    data = {
        "object_name": "Program",
        "filters": {
            "expression": {
                "left": "title",
                "op": {"name": "="},
                "right": title,
            },
        },
    }
    response = json.loads(self._post(data).data)[0]
    programs = response.get("Program")
    self.assertIsNot(programs, None)
    self.assertEqual(programs["count"], 1)
    self.assertEqual(len(programs["values"]), programs["count"])
    self.assertEqual(programs["values"][0]["title"], title)

  def test_basic_query_in(self):
    """Filter by ~ operator."""
    title_pattern = "1"
    data = {
        "object_name": "Program",
        "filters": {
            "expression": {
                "left": "title",
                "op": {"name": "~"},
                "right": title_pattern,
            },
        },
    }
    programs = self._get_first_result_set(data, "Program")
    self.assertEqual(programs["count"], 12)
    self.assertEqual(len(programs["values"]), programs["count"])
    self.assertTrue(all(title_pattern in program["title"]
                        for program in programs["values"]))

  def test_basic_query_ne(self):
    """Filter by != operator."""
    title = "Cat ipsum 1"
    data = {
        "object_name": "Program",
        "filters": {
            "expression": {
                "left": "title",
                "op": {"name": "!="},
                "right": title,
            },
        },
    }
    programs = self._get_first_result_set(data, "Program")
    self.assertEqual(programs["count"], 22)
    self.assertEqual(len(programs["values"]), programs["count"])
    self.assertTrue(all(program["title"] != title
                        for program in programs["values"]))

  def test_basic_query_not_in(self):
    """Filter by !~ operator."""
    title_pattern = "1"
    data = {
        "object_name": "Program",
        "filters": {
            "expression": {
                "left": "title",
                "op": {"name": "!~"},
                "right": title_pattern,
            },
        },
    }
    programs = self._get_first_result_set(data, "Program")
    self.assertEqual(programs["count"], 11)
    self.assertEqual(len(programs["values"]), programs["count"])
    self.assertTrue(all(title_pattern not in program["title"]
                        for program in programs["values"]))

  def test_basic_query_lt(self):
    """Filter by < operator."""
    date = datetime(2015, 5, 18)
    data = {
        "object_name": "Program",
        "filters": {
            "expression": {
                "left": "effective date",
                "op": {"name": "<"},
                "right": date.strftime(DATE_FORMAT_REQUEST),
            },
        },
    }
    programs = self._get_first_result_set(data, "Program")
    self.assertEqual(programs["count"], 9)
    self.assertEqual(len(programs["values"]), programs["count"])
    self.assertTrue(
        all(datetime.strptime(program["start_date"],
                              DATE_FORMAT_RESPONSE) < date
            for program in programs["values"]),
    )

  def test_basic_query_gt(self):
    """Filter by > operator."""
    date = datetime(2015, 5, 18)
    data = {
        "object_name": "Program",
        "filters": {
            "expression": {
                "left": "effective date",
                "op": {"name": ">"},
                "right": date.strftime(DATE_FORMAT_REQUEST),
            },
        },
    }
    programs = self._get_first_result_set(data, "Program")
    self.assertEqual(programs["count"], 13)
    self.assertEqual(len(programs["values"]), programs["count"])
    self.assertTrue(
        all(datetime.strptime(program["start_date"],
                              DATE_FORMAT_RESPONSE) > date
            for program in programs["values"]),
    )

  def test_basic_query_text_search(self):
    """Filter by fulltext search."""
    text_pattern = "ea"
    data = {
        "object_name": "Regulation",
        "fields": ["description", "notes"],
        "filters": {
            "expression": {
                "op": {"name": "text_search"},
                "text": text_pattern,
            },
        },
    }
    regulations = self._get_first_result_set(data, "Regulation")
    self.assertEqual(regulations["count"], 21)
    self.assertEqual(len(regulations["values"]), regulations["count"])
    self.assertTrue(all((regulation["description"] and
                         text_pattern in regulation["description"]) or
                        (regulation["notes"] and
                         text_pattern in regulation.get("notes", ""))
                        for regulation in regulations["values"]))

  def test_basic_query_pagination(self):
    """Test basic query with pagination info."""
    from_, to_ = 1, 12
    data = {
        "object_name": "Program",
        "order_by": [{
            "name": "title",
        }],
        "limit": [from_, to_],
        "filters": {
            "expression": {
                "left": "title",
                "op": {"name": "~"},
                "right": "Cat ipsum",
            },
        },
    }
    programs = self._get_first_result_set(data, "Program")
    self.assertEqual(programs["count"], to_ - from_)
    self.assertEqual(len(programs["values"]), programs["count"])
    self.assertEqual(programs["total"], 23)

  def test_basic_query_total(self):
    """The value of "total" doesn't depend on "limit" parameter."""
    data_no_limit = {
        "object_name": "Program",
        "filters": {
            "expression": {
                "left": "title",
                "op": {"name": "~"},
                "right": "Cat ipsum",
            },
        },
    }
    programs_no_limit = self._get_first_result_set(data_no_limit, "Program")
    self.assertEqual(programs_no_limit["count"], programs_no_limit["total"])

    from_, to_ = 3, 5
    data_limit = data_no_limit.copy()
    data_limit.update({
        "limit": [from_, to_],
    })
    programs_limit = self._get_first_result_set(data_limit, "Program")
    self.assertEqual(programs_limit["count"], to_ - from_)

    self.assertEqual(programs_limit["total"], programs_no_limit["total"])

  def test_query_order_by(self):
    """Results get sorted by own field."""
    # assumes unique title

    def get_titles(programs):
      return [program["title"] for program in programs]

    data_default = {
        "object_name": "Program",
        "order_by": [{"name": "title"}],
        "filters": {"expression": {}},
    }
    programs_default = self._get_first_result_set(data_default,
                                                  "Program", "values")
    titles_default = get_titles(programs_default)

    data_asc = {
        "object_name": "Program",
        "order_by": [{"name": "title", "desc": False}],
        "filters": {"expression": {}},
    }
    programs_asc = self._get_first_result_set(data_asc,
                                              "Program", "values")
    titles_asc = get_titles(programs_asc)

    data_desc = {
        "object_name": "Program",
        "order_by": [{"name": "title", "desc": True}],
        "filters": {"expression": {}},
    }
    programs_desc = self._get_first_result_set(data_desc,
                                               "Program", "values")
    titles_desc = get_titles(programs_desc)

    # the titles are sorted ascending with desc=False
    self.assertListEqual(titles_asc, sorted(titles_asc))
    # desc=False by default
    self.assertListEqual(titles_default, titles_asc)
    # the titles are sorted descending with desc=True
    self.assertListEqual(titles_desc, list(reversed(titles_asc)))

  def test_query_order_by_several_fields(self):
    """Results get sorted by two fields at once."""
    data = {
        "object_name": "Regulation",
        "order_by": [{"name": "notes", "desc": True}, {"name": "title"}],
        "filters": {"expression": {}},
    }
    regulations = self._get_first_result_set(data,
                                             "Regulation", "values")

    data_unsorted = {
        "object_name": "Regulation",
        "filters": {"expression": {}},
    }
    regulations_unsorted = self._get_first_result_set(data_unsorted,
                                                      "Regulation", "values")

    self.assertListEqual(
        regulations,
        sorted(sorted(regulations_unsorted,
                      key=itemgetter("title")),
               key=itemgetter("notes"),
               reverse=True),
    )

  def test_query_order_by_related_titled(self):
    """Results get sorted by title of related Titled object."""
    data_title = {
        "object_name": "Audit",
        "order_by": [{"name": "program"}, {"name": "id"}],
        "filters": {"expression": {}},
    }
    audits_title = self._get_first_result_set(data_title,
                                              "Audit", "values")

    data_unsorted = {
        "object_name": "Audit",
        "filters": {"expression": {}},
    }
    audits_unsorted = self._get_first_result_set(data_unsorted,
                                                 "Audit", "values")

    # get titles from programs to check ordering
    data_program = {
        "object_name": "Program",
        "filters": {"expression": {}},
    }
    programs = self._get_first_result_set(data_program,
                                          "Program", "values")
    program_id_title = {program["id"]: program["title"]
                        for program in programs}

    self.assertListEqual(
        audits_title,
        sorted(sorted(audits_unsorted, key=itemgetter("id")),
               key=lambda a: program_id_title[a["program"]["id"]]),
    )

  def test_query_order_by_person(self):
    """Results get sorted by name or email related Person object."""
    data_person = {
        "object_name": "Clause",
        "order_by": [{"name": "contact"}, {"name": "id"}],
        "filters": {"expression": {}},
    }
    clauses_person = self._get_first_result_set(data_person,
                                                "Clause", "values")

    data_unsorted = {
        "object_name": "Clause",
        "filters": {"expression": {}},
    }
    clauses_unsorted = self._get_first_result_set(data_unsorted,
                                                  "Clause", "values")

    # get names and emails from people to check ordering
    data_people = {
        "object_name": "Person",
        "filters": {"expression": {}},
    }
    people = self._get_first_result_set(data_people,
                                        "Person", "values")
    person_id_name = {person["id"]: (person["name"], person["email"])
                      for person in people}

    self.assertListEqual(
        clauses_person,
        sorted(sorted(clauses_unsorted, key=itemgetter("id")),
               key=lambda c: person_id_name[c["contact"]["id"]]),
    )

  def test_query_count(self):
    """The value of "count" is same for "values" and "count" queries."""
    data_values = {
        "object_name": "Program",
        "type": "values",
        "filters": {
            "expression": {
                "left": "title",
                "op": {"name": "~"},
                "right": "Cat ipsum",
            },
        },
    }
    programs_values = self._get_first_result_set(data_values, "Program")

    data_count = {
        "object_name": "Program",
        "type": "count",
        "filters": {
            "expression": {
                "left": "title",
                "op": {"name": "~"},
                "right": "Cat ipsum",
            },
        },
    }
    programs_count = self._get_first_result_set(data_count, "Program")

    self.assertEqual(programs_values["count"], programs_count["count"])

  def test_query_ids(self):
    """The ids are the same for "values" and "ids" queries."""
    data_values = {
        "object_name": "Program",
        "type": "values",
        "filters": {
            "expression": {
                "left": "title",
                "op": {"name": "~"},
                "right": "Cat ipsum",
            },
        },
    }
    programs_values = self._get_first_result_set(data_values, "Program")

    data_ids = {
        "object_name": "Program",
        "type": "ids",
        "filters": {
            "expression": {
                "left": "title",
                "op": {"name": "~"},
                "right": "Cat ipsum",
            },
        },
    }
    programs_ids = self._get_first_result_set(data_ids, "Program")

    self.assertEqual(
        set(obj.get("id") for obj in programs_values["values"]),
        set(programs_ids["ids"]),
    )

  @SkipTest
  def test_self_link(self):
    # It would be good if the api accepted get requests and we could add the
    # query into a get parameter, then each request would also get a self link
    # that could be tested to see that it truly returns what the original
    # request was.
    # In the end, instead of returning mapped object stubs like we do now, we'd
    # just return a self link for fetching those objects.
    pass

  def test_multiple_queries(self):
    """Multiple queries POST is identical to multiple single-query POSTs."""
    data_list = [
        {
            "object_name": "Program",
            "order_by": [{
                "name": "title",
            }],
            "limit": [1, 12],
            "filters": {
                "expression": {
                    "left": "title",
                    "op": {"name": "~"},
                    "right": "Cat ipsum",
                },
            },
        },
        {
            "object_name": "Program",
            "type": "values",
            "filters": {
                "expression": {
                    "left": "title",
                    "op": {"name": "~"},
                    "right": "Cat ipsum",
                },
            },
        },
        {
            "object_name": "Program",
            "type": "count",
            "filters": {
                "expression": {
                    "left": "title",
                    "op": {"name": "~"},
                    "right": "Cat ipsum",
                },
            },
        },
        {
            "object_name": "Program",
            "type": "ids",
            "filters": {
                "expression": {
                    "left": "title",
                    "op": {"name": "~"},
                    "right": "Cat ipsum",
                },
            },
        },
        {
            "object_name": "Program",
            "filters": {
                "expression": {
                    "left": "title",
                    "op": {"name": "="},
                    "right": "Cat ipsum 1",
                },
            },
        },
        {
            "object_name": "Program",
            "filters": {
                "expression": {
                    "left": "title",
                    "op": {"name": "~"},
                    "right": "1",
                },
            },
        },
        {
            "object_name": "Program",
            "filters": {
                "expression": {
                    "left": "title",
                    "op": {"name": "!="},
                    "right": "Cat ipsum 1",
                },
            },
        },
        {
            "object_name": "Program",
            "filters": {
                "expression": {
                    "left": "title",
                    "op": {"name": "!~"},
                    "right": "`",
                },
            },
        },
        {
            "object_name": "Program",
            "filters": {
                "expression": {
                    "left": "effective date",
                    "op": {"name": "<"},
                    "right": "05/18/2015",
                },
            },
        },
        {
            "object_name": "Program",
            "filters": {
                "expression": {
                    "left": "effective date",
                    "op": {"name": ">"},
                    "right": "05/18/2015",
                },
            },
        },
        {
            "object_name": "Regulation",
            "fields": ["description", "notes"],
            "filters": {
                "expression": {
                    "op": {"name": "text_search"},
                    "text": "ea",
                },
            },
        },
    ]

    response_multiple_posts = [json.loads(self._post(data).data)[0]
                               for data in data_list]
    response_single_post = json.loads(self._post(data_list).data)

    self.assertEqual(response_multiple_posts, response_single_post)
