# Tabloo [![Build Status](https://travis-ci.org/bluenote10/tabloo.svg?branch=master)](https://travis-ci.org/bluenote10/tabloo) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE)

Minimalistic dashboard app for visualizing tabular data -- WIP.

![demo](/../examples/examples/basic_demo.gif)


## Installation

```sh
pip install tabloo
```


## Usage

### Embedded mode

Run tabloo from within Python on an instance of a Pandas DataFrame:

```python
# given a pandas dataframe `df`
import tabloo
tabloo.show(df)
```


### CLI mode

Run tabloo from the command line on a CSV file:

```sh
tabloo_cli my.csv
```

### Bring our own backend

Tabloo decouples the visualization frontend from the data backend.
You could drive the frontend by arbitrary data backends, i.e.,
instead of running from DataFrames, you may implement a backend accessing other data sources like databases.
This implies that backends can be implemented in any other language.
Currently the backend API is still under development and may change.
For now, the [flask backend](src_backend_python/tabloo/server.py) can serve as a reference implementation.


## Usage notes

Currently the "Filter" input element accepts `DataFrame.query()` expressions.
It handles expressions like:

```
# filter by specific values
SomeColumn == "some value"

# standard inequality operations are supported
SomeNumberColumn > 0

# it's possible to use advanced string conditions via `.str`
SomeStringColumn.str.len() < 10

# Combining conditions is possible with & | and or
ColumnA == 42 & SomeStringColumn.str.contains("substring")
```

Refer to documentation of [query()](https://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html#indexing-query) for more examples.

Note: Eventually the syntax may change into a Pandas agnostic syntax to simplify implementations in non-Pandas backends.
