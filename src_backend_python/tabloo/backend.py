from __future__ import division, print_function

import math
import traceback

import pandas as pd


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

        def convert_column(col):
            # TODO: handle +/- inf handling to satisfy JSON standard
            return list(col.replace({pd.np.nan: None}))

        data = [
            {
                "columnName": columnName,
                "values": convert_column(df[columnName]),
                "sortKind": 0 if columnName != sort_column else sort_kind,
            }
            for columnName in df.columns
        ]
        return data
