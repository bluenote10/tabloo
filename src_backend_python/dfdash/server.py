from __future__ import division, print_function

from flask import Flask, send_from_directory, redirect, request, make_response
from flask_cors import CORS

import json

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


def to_json(obj):
    """
    We don't use jsonify from flask because
    - it doesn't allow to pass options to the JSON encoder
    - it secretly switches to simplejson when available

    Using simplejson might actually be a good option, because in contrast
    to the built-in JSON encoder, it has the `ignore_nan` options, which
    allows to encode NaN/Inf as null. The builtin json encoder actually
    produces malformed JSON in these cases... And its `allow_nan` option
    only allows to throw on NaN/Inf, no conversion to null as would be
    needed by the standard.

    simplejson would solve this issue, but is also not a good option,
    because it is a non-trivial dependency. It can be used Python-only,
    but then it is terribly slow. There is a C extension, but this requires
    native compilers on user side.

    What a mess... The best solution is to handle NaN/Inf within Pandas...

    See:
      - https://stackoverflow.com/questions/28639953/python-nan-json-encoder

    This reimplements jsonify based on this info:
      - https://stackoverflow.com/a/16003910/1804173
      - https://stackoverflow.com/questions/11945523/forcing-application-json-mime-type-in-a-view-flask
    """
    # This would be the simplejson variant, but just too slow...
    # response = make_response(simplejson.dumps(obj, ignore_nan=True))
    response = make_response(json.dumps(obj, allow_nan=False))
    response.mimetype = "application/json"
    return response


@app.route('/api/get_columns')
def get_columns():
    return to_json(backend.get_columns())


@app.route('/api/get_data')
def get_data():
    sort_column = request.args.get("sortColumn")
    sort_kind = int(request.args.get("sortKind", 0))
    return to_json(backend.get_data(sort_column, sort_kind))


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
