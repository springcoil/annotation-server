import os
import glob
import flask

app = flask.Flask(__name__)


IMAGE_PATH = '../o2'
IMAGES = sorted(x.split('/')[-1] for x in glob.glob(os.path.join(IMAGE_PATH, '*')))

@app.route('/favicon.ico')
def ignore():
    return ""

@app.route('/<path:name>', methods=['GET', 'POST'])
def annotate(name):
    data_path = os.path.join(IMAGE_PATH, name + '.json')
    if flask.request.method == 'POST':
        with open(data_path, 'w') as f:
            f.write(flask.request.get_data())
        return ""

    next = IMAGES[IMAGES.index(name) + 1]
    prev = IMAGES[IMAGES.index(name) - 1]

    if os.path.exists(data_path):
        with open(data_path) as f:
            points = f.read()
    else:
        points = 'undefined'

    return flask.render_template(
        'annotate.html',
        name=name,
        next=next,
        prev=prev,
        points=points,
    )


@app.route('/')
def land():
    return flask.redirect(IMAGES[0])


@app.route('/image/<path:path>')
def send_js(path):
    return flask.send_from_directory(IMAGE_PATH, path)


if __name__ == '__main__':
    app.run(debug=True)
