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