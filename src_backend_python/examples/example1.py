#!/usr/bin/env python

import numpy as np
import pandas as pd

import tabloo

N = 1000
df = pd.DataFrame(
    {
        "id": np.arange(N),
        "xs": np.random.uniform(-1, +1, N),
        "ys": np.random.uniform(-1, +1, N),
    }
)
df.loc[::10, "xs"] = np.nan
df.loc[::20, "ys"] = np.nan
df.loc[::47, "xs"] = +np.inf
df.loc[::83, "xs"] = -np.inf
# df["Column with much too long name"] = 0

tabloo.show(df, open_browser=True, debug=True, server_logging=False)
