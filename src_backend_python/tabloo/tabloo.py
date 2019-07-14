from __future__ import division, print_function

import server


def show(df,
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
