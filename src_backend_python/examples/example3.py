#!/usr/bin/env python

import pandas as pd
import numpy as np

import tabloo

N = 100
df = pd.DataFrame({
    "id": np.arange(N),
    "xs": np.random.uniform(-1, +1, N),
    "ys": np.random.uniform(-1, +1, N),
})

tabloo.embedHTML(df, "test.html")
