#!/usr/bin/env python

import pandas as pd
import numpy as np

import dfdash

N = 100
df = pd.DataFrame({
    "id": np.arange(N),
    "xs": np.random.uniform(-1, +1, N),
    "ys": np.random.uniform(-1, +1, N),
})

dfdash.show(df)
