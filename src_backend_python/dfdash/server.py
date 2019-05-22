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

@app.after_request
def add_header(response):
    # https://stackoverflow.com/a/23115561
    # https://stackoverflow.com/questions/34066804/disabling-caching-in-flask#comment94259421_34067710
    # https://werkzeug.palletsprojects.com/en/0.14.x/datastructures/#werkzeug.datastructures.ResponseCacheControl.no_cache
    response.cache_control.max_age = 300
    response.cache_control.public = True
    response.cache_control.no_cache = True
    response.cache_control.no_store = True
    return response


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
