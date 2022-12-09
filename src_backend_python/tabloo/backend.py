import json
import math
import traceback

import numpy as np
import pandas as pd


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

    # TODO: we should use recursion here so that conversion errors only affect
    # inner data elements, so that the "invalid" data_string isn't applied on
    # the global conversion but ideally on values, or at least on entire columns.
    try:
        data_string = json.dumps(data, default=converter, allow_nan=False, ensure_ascii=False)
    except Exception:
        traceback.print_exc()
        data_string = ""
    return data_string


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
    # We cannot use col.replace({np.nan: None}) because of
    # https://github.com/pandas-dev/pandas/issues/29813

    # And we have to convert to object columns early because float columns
    # have special treatments for None. In particular setting c[is_null] = None
    # has no effect on a float column, because they get immediately converted
    # back to np.nan, which is what we want to replace...
    c = col.copy().astype(object)

    is_null = c.isnull()
    c[is_null] = None

    try:
        # Note that the c == +np.inf checks can fail with
        # 'ValueError: The truth value of an array with more than one element is ambiguous.'
        # in case the elements themselves are vectors/matrices.
        is_pos_inf = c == +np.inf
        is_neg_inf = c == -np.inf

        c[is_pos_inf] = "inf"
        c[is_neg_inf] = "-inf"
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
