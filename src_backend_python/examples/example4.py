#!/usr/bin/env python

import random
import pandas as pd
import numpy as np

import tabloo


def random_text(N):
    return "".join(
        random.choice("abcdefgh ") for _ in range(N)
    )


N = 1000
df = pd.DataFrame({
    "id": np.arange(N),
    "xs": np.random.uniform(-1, +1, N),
    "ys": np.random.uniform(-1, +1, N),
})

for i in range(10):
    df["text_col_{}".format(i)] = [random_text(random.randint(0, 1000)) for _ in range(N)]

df[random_text(1000)] = 0

tabloo.show(df, open_browser=False, server_logging=True)
