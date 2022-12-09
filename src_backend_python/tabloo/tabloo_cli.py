#!/usr/bin/env python
"""
Tabloo -- Minimalistic dashboard app for visualizing tabular data.
"""

import argparse
import sys

import pandas as pd

import tabloo


def parse_args(args=sys.argv[1:]):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "file",
        metavar="<FILE>",
        help="CSV file to load.",
    )
    parser.add_argument(
        "--sep",
        help="Separator character for CSV files.",
    )
    args = parser.parse_args(args=args)
    return args


def main():
    args = parse_args()

    loader_kwargs = dict()
    if args.sep is not None:
        loader_kwargs["sep"] = args.sep
    df = pd.read_csv(args.file, **loader_kwargs)

    tabloo.show(
        df,
        server_logging=True,
    )


if __name__ == "__main__":
    main()
