from __future__ import division, print_function

import math
import pandas as pd


class Backend(object):
    def __init__(self, df):
        self.df = df

    def get_columns(self):
        return list(self.df.columns)

    def get_num_pages(self, pagination_size):
        if pagination_size < 1:
            pagination_size = 1
        return int(math.ceil(len(self.df) / pagination_size))

    def get_data(self, sort_column, sort_kind, page, pagination_size):
        if sort_column is not None:
            asc = sort_kind > 0
            self.df.sort_values(sort_column, inplace=True, ascending=asc)
        if sort_kind == 0:
            self.df.sort_index(inplace=True)

        if page is not None and pagination_size is not None:
            i = pagination_size * page
            j = pagination_size * (page + 1)
            df = self.df.iloc[i:j, :]
        else:
            df = self.df

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
