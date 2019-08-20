from __future__ import division, print_function

import json
import math
import traceback

import pandas as pd
import numpy as np


def to_json(data):
    """
    Accompanying function to get_data for generic json encoding.
    """

    def converter(x):
        if isinstance(x, np.ndarray):
            return list(x)
        elif isinstance(x, pd.Series):
            return x.to_dict()
        elif isinstance(x, pd.DataFrame):
            return x.to_dict(orient="list")
        else:
            try:
                return list(x)
            except Exception:
                pass
            try:
                return dict(x)
            except Exception:
                pass
            return str(x)
    return json.dumps(data, default=converter, allow_nan=False)


def apply_filter(df, filter):
    if filter is not None and len(filter.strip()) > 0:
        try:
            df = df.query(filter)
            return df
        except pd.core.computation.ops.UndefinedVariableError as e:
            # TODO: We should be able to pass errors/messages from the backend to the frontend
            print("UndefinedVariableError: {}".format(e.message))
            return df
        except Exception as e:
            # TODO: We should be able to pass errors/messages from the backend to the frontend
            print("Illegal query:")
            print(traceback.format_exc())
            return df
    else:
        return df


def convert_column(col):
    # TODO: Add more tests...
    # TODO: How to deeply convert nested nans/infs for json conversion?
    c = col.replace({np.nan: None})
    try:
        c = c.replace({
            +np.inf: "inf",
            -np.inf: "-inf",
        })
    except:
        pass
    return list(c)


class Backend(object):
    def __init__(self, df):
        self.df = df

    def get_columns(self):
        return list(self.df.columns)

    def get_num_pages(self, pagination_size, filter):
        if pagination_size < 1:
            pagination_size = 1

        df = self.df
        df = apply_filter(df, filter)

        return int(math.ceil(len(df) / pagination_size))

    def get_data(self, filter, sort_column, sort_kind, page, pagination_size):
        df = self.df
        df = apply_filter(df, filter)

        if sort_column is not None:
            asc = sort_kind > 0
            df.sort_values(sort_column, inplace=True, ascending=asc)
        if sort_kind == 0:
            df.sort_index(inplace=True)

        if page is not None and pagination_size is not None:
            i = pagination_size * page
            j = pagination_size * (page + 1)
            df = df.iloc[i:j, :]

        data = [
            {
                "columnName": columnName,
                "values": convert_column(df[columnName]),
                "sortKind": 0 if columnName != sort_column else sort_kind,
            }
            for columnName in df.columns
        ]
        return data
