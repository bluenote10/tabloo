#!/usr/bin/env python

import numpy as np
import pandas as pd

import tabloo


def generate_random_trajectory():
    length = 1000
    lat = 48.8992999
    lng = 9.1954815

    coordinates = []
    delta = np.random.uniform(-1, +1, size=2)
    delta = delta / np.sqrt(np.sum(delta**2)) / 10000
    for i in range(length):
        coordinates.append([lat, lng])
        lat += delta[0]
        lng += delta[1]
        delta += np.random.uniform(-0.00001, +0.00001, size=2)

    return {
        "type": "LineString",
        "coordinates": coordinates,
    }


N = 1000
df = pd.DataFrame(
    {
        "Drive": ["Drive {}".format(i) for i in range(N)],
        "Trajectory": [generate_random_trajectory() for _ in range(N)],
    }
)

tabloo.show(df, open_browser=False, server_logging=True)
