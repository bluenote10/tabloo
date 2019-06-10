from __future__ import division, print_function


class Backend(object):
    def __init__(self, df):
        self.df = df

    def get_columns(self):
        return list(self.df.columns)

    def get_data(self, sort_column, sort_kind):
        if sort_column is not None:
            asc = sort_kind > 0
            print(asc)
            self.df.sort_values(sort_column, inplace=True, ascending=asc)
        if sort_kind == 0:
            self.df.sort_index(inplace=True)
        data = [
            {
                "columnName": columnName,
                "values": list(self.df[columnName]),
                "sortKind": 0 if columnName != sort_column else sort_kind,
            }
            for columnName in self.df.columns
        ]
        return data
