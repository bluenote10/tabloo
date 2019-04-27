from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS

import random, threading, webbrowser
import numpy as np

app = Flask(__name__)
CORS(app)


@app.route('/api/get_data')
def hello_world():

    datasets = {
        "xs": list(np.random.uniform(-1, +1, 100)),
        "ys": list(np.random.uniform(-1, +1, 100)),
    }

    return jsonify(datasets)


@app.route('/index.html')
def index():
    return send_from_directory("../build", "index.html")


@app.route('/renderer.js')
def renderer():
    return send_from_directory("../build", "renderer.js")

#url_for('static', filename='style.css')


if __name__ == "__main__":
    port = 5000 # + random.randint(0, 999)
    url = "http://127.0.0.1:{0}".format(port)

    threading.Timer(1.25, lambda: webbrowser.open(url)).start()

    app.run(port=port, debug=True)
