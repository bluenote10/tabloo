import logging
import threading
import webbrowser

from flask import Flask, make_response, redirect, request
from flask_cors import CORS

from .backend import Backend, to_json

app = Flask(
    __name__,
    static_url_path="",
    static_folder="static",
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


def json_response(data):
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
    response = make_response(to_json(data))
    response.mimetype = "application/json"
    return response


@app.route("/api/get_columns")
def get_columns():
    return json_response(backend.get_columns())


@app.route("/api/get_num_pages")
def get_num_pages():
    pagination_size = int(request.args.get("paginationSize", 20))
    filter = request.args.get("filter")
    return json_response(backend.get_num_pages(pagination_size, filter))


@app.route("/api/get_data")
def get_data():
    filter = request.args.get("filter")

    sort_column = request.args.get("sortColumn")
    sort_kind = int(request.args.get("sortKind", 0))

    page = request.args.get("page")
    pagination_size = request.args.get("paginationSize")
    if page is not None:
        page = int(page)
    if pagination_size is not None:
        pagination_size = int(pagination_size)

    return json_response(backend.get_data(filter, sort_column, sort_kind, page, pagination_size))


@app.route("/")
def index():
    return redirect("index.html")


def serve(df, open_browser, server_port=5000, server_logging=True, debug=False):
    # TODO: We may add some auto port handling like this: https://stackoverflow.com/a/5089963/1804173

    url = "http://127.0.0.1:{0}".format(server_port)

    global backend
    backend = Backend(df)

    if not server_logging:
        logging.getLogger("werkzeug").disabled = True

    if not server_logging and not open_browser:
        # https://stackoverflow.com/a/56856877/1804173
        print(f"Running on {url}")

    if open_browser:
        threading.Timer(0.25, lambda: webbrowser.open(url)).start()

    app.run(
        port=server_port,
        debug=debug,
        use_reloader=debug,
        processes=1,
        threaded=False,
    )
