from __future__ import division, print_function

from flask import Flask, send_from_directory, jsonify, redirect
from flask_cors import CORS

import random, threading, webbrowser
import numpy as np

from backend import Backend


app = Flask(
    __name__,
    static_url_path='',
    static_folder='static',
)
CORS(app)

backend = None


@app.route('/api/get_data')
def get_data():
    return jsonify(backend.get_data())


@app.route('/')
def index():
    return redirect("index.html")


def serve(df):
    port = 5000
    url = "http://127.0.0.1:{0}".format(port)

    global backend
    backend = Backend(df)
    # threading.Timer(1.25, lambda: webbrowser.open(url)).start()

    app.run(
        port=port,
        debug=True,
        processes=1,
        threaded=False,
    )
