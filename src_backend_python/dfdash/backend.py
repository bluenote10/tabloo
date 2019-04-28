from __future__ import division, print_function


class Backend(object):
    def __init__(self, df):
        self.df = df

    def get_data(self):
        return self.df.to_dict(orient="list")
