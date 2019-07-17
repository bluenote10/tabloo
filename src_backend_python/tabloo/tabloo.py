from __future__ import division, print_function

import os
import json
import pandas as pd

from . import server


def show(
        df,
        open_browser=True,
        server_logging=False,
        server_port=5000):
    """
    Runs a Tabloo app on a given dataframe.

    :param df: pandas.DataFrame
        The dataframe to display.
    :param open_browser: bool
        Whether to open the web browser automatically.
    :param server_logging: bool
        Whether enable web server logging (for debugging).
    :param server_port: int
        Port of web server.
    :return:
    """
    server.serve(
        df=df,
        open_browser=open_browser,
        server_logging=server_logging,
        server_port=server_port,
    )


def embedHTML(df, filename):
    static_dir = os.path.join(
        os.path.dirname(__file__),
        "static",
    )

    def load_asset(filename):
        path = os.path.join(static_dir, filename)
        with open(path) as f:
            return f.read()

    asset_html = load_asset("index_standalone.html")
    asset_js = load_asset("main_standalone.js")
    asset_css = load_asset("styles.css")

    def escape(s):
        # This is super fragile; let's see if this is viable at all...
        # https://stackoverflow.com/a/23983448/1804173
        # https://blog.uploadcare.com/vulnerability-in-html-design-the-script-tag-33d24642359e
        return s.replace("</script", "</scr\\ipt")\
                .replace("<script", "<\\script") \
                .replace("<!--", "<\\!--")

    # TODO: factor out df to json conversion
    column_data = json.dumps(list(df.columns))

    def convert_column(col):
        # TODO: handle +/- inf handling to satisfy JSON standard
        return list(col.replace({pd.np.nan: None}))

    table_data = json.dumps([
        {
            "columnName": columnName,
            "values": convert_column(df[columnName]),
            "sortKind": 0, # if columnName != sort_column else sort_kind,
        }
        for columnName in df.columns
    ])

    html = asset_html.format(
        SCRIPT=escape(asset_js),
        STYLES=asset_css,   # TODO: check rules for escaping style
        TABLOO_COLUMN_DATA=escape(column_data),
        TABLOO_TABLE_DATA=escape(table_data),
    )
    with open(filename, "w") as f:
        f.write(html)

    print("Written HTML: '{}'".format(filename))
