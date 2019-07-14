#!/usr/bin/env python

import os
import pandas as pd

import tabloo

csv_file = os.path.join(os.path.dirname(__file__), "Bundesliga.csv")
df = pd.read_csv(csv_file)
tabloo.show(df)
