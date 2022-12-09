import datetime
import json

import numpy as np
import pandas as pd
import pytest

from tabloo.backend import Backend, convert_column, to_json


@pytest.fixture
def df_simple():
    df = pd.DataFrame(
        {
            "A": [1, 3, 2],
            "B": [6, 5, 4],
        }
    )
    df = df[sorted(df.columns)]
    return df


@pytest.fixture
def df_with_custom_column_types(df_simple):
    df = pd.DataFrame(
        {
            "A": [1, None, 3],
            "B": [np.array([1, 2, 3]), np.array([2, 3, 4]), np.array([3, 4, 5])],
            "C": [pd.Series([1, 2, 3]), pd.Series([2, 3, 4]), pd.Series([3, 4, 5])],
            "D": [df_simple, df_simple, df_simple],
            "E": [{"a": 1}, {"b": 2}, {"c": 3}],
            "F": [None, None, None],
            "G": [
                datetime.datetime.utcfromtimestamp(0),
                datetime.datetime.utcfromtimestamp(1e9),
                datetime.datetime.utcfromtimestamp(1e10),
            ],
            "pure_strings_1": ["hello", "world", "a b c"],
            "pure_strings_2": ["1", "2", "3"],
            "pure_strings_3": ["1.0", "2.0", "3.0"],
            "mixed_types_1": ["1", 1, 1.0],
            "mixed_types_2": [None, "None", "null"],
        }
    )
    df = df[sorted(df.columns)]
    return df


def test_backend__basic(df_simple):
    backend = Backend(df_simple)

    assert backend.get_columns() == ["A", "B"]

    assert backend.get_data(
        filter=None,
        sort_column=None,
        sort_kind=0,
        page=None,
        pagination_size=None,
    ) == [
        {"columnName": "A", "sortKind": 0, "values": [1, 3, 2]},
        {"columnName": "B", "sortKind": 0, "values": [6, 5, 4]},
    ]

    assert backend.get_data(
        filter=None,
        sort_column="A",
        sort_kind=1,
        page=None,
        pagination_size=None,
    ) == [
        {"columnName": "A", "sortKind": 1, "values": [1, 2, 3]},
        {"columnName": "B", "sortKind": 0, "values": [6, 4, 5]},
    ]

    assert backend.get_data(
        filter=None,
        sort_column="A",
        sort_kind=-1,
        page=None,
        pagination_size=None,
    ) == [
        {"columnName": "A", "sortKind": -1, "values": [3, 2, 1]},
        {"columnName": "B", "sortKind": 0, "values": [5, 4, 6]},
    ]


def test_backend__json_convertability(df_with_custom_column_types):
    backend = Backend(df_with_custom_column_types)

    data = backend.get_data(
        filter=None,
        sort_column=None,
        sort_kind=0,
        page=None,
        pagination_size=None,
    )

    data_json_string = to_json(data)
    data_json = json.loads(data_json_string)

    print(data_json_string)

    # More compact check in case the above gets tedious to maintain...
    def get(col):
        return [row["values"] for row in data_json if row["columnName"] == col][0]

    assert get("A") == [1.0, None, 3.0]
    # FIXME: There seems to be a difference in Py2 vs Py3: For some reason in Py3 the ints become strings...
    # assert get("B") == [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
    assert get("C") == [
        {"0": 1, "1": 2, "2": 3},
        {"0": 2, "1": 3, "2": 4},
        {"0": 3, "1": 4, "2": 5},
    ]
    assert get("D") == [
        {"A": [1, 3, 2], "B": [6, 5, 4]},
        {"A": [1, 3, 2], "B": [6, 5, 4]},
        {"A": [1, 3, 2], "B": [6, 5, 4]},
    ]
    assert get("E") == [{"a": 1}, {"b": 2}, {"c": 3}]
    assert get("F") == [None, None, None]
    assert get("G") == [
        "1970-01-01 00:00:00",
        "2001-09-09 01:46:40",
        "2286-11-20 17:46:40",
    ]

    assert get("pure_strings_1") == ["hello", "world", "a b c"]
    assert get("pure_strings_2") == ["1", "2", "3"]
    assert get("pure_strings_3") == ["1.0", "2.0", "3.0"]
    assert get("mixed_types_1") == ["1", 1, 1.0]
    assert get("mixed_types_2") == [None, "None", "null"]


def test_convert_column():
    c = pd.Series([1, 2, 3])
    assert convert_column(c) == [1, 2, 3]

    c = pd.Series([1, 2, 3], index=[30, 20, 10])
    assert convert_column(c) == [1, 2, 3]

    c = pd.Series([None, "1", 2])
    assert convert_column(c) == [None, "1", 2]

    c = pd.Series([1, None, 2])
    assert convert_column(c) == [1, None, 2]

    c = pd.Series([1, np.nan, 2])
    assert convert_column(c) == [1, None, 2]

    c = pd.Series([1, np.inf, 2])
    assert convert_column(c) == [1, "inf", 2]

    c = pd.Series([1, -np.inf, 2])
    assert convert_column(c) == [1, "-inf", 2]

    # Bug https://github.com/pandas-dev/pandas/issues/29813
    c = pd.Series([np.nan, 1.0, "hello"])
    c = c[0:2]
    assert convert_column(c) == [None, 1.0]
