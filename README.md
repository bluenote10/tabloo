# Tabloo

Minimalistic dashboard app for visualizing tabular data -- WIP.

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