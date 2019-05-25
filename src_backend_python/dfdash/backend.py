from __future__ import division, print_function


class Backend(object):
    def __init__(self, df):
        self.df = df

    def get_data(self, sortColumn, sortKind):
        print(sortColumn, sortKind)
        if sortColumn is not None:
            asc = sortKind > 0
            print(asc)
            self.df.sort_values(sortColumn, inplace=True, ascending=asc)
        if sortKind == 0:
            self.df.sort_index(inplace=True)
        data = [
            {
                "columnName": columnName,
                "values": list(self.df[columnName]),
                "sortKind": 0 if columnName != sortColumn else sortKind,
            }
            for columnName in self.df.columns
        ]
        return data
        #return self.df.to_dict(orient="list")
