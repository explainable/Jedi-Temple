from flask import Flask, escape, request, jsonify, render_template, send_file
import json
from werkzeug.utils import secure_filename
import os
from mnist_cnn import get_info
from titanic import classify

UPLOAD_FOLDER = 'uploaded_images';
ALLOWED_EXTENSIONS = {'png'}

app = Flask(__name__,
    static_url_path='', 
    static_folder='templates', # should this have a different name?
    #template_folder='web/templates'    ) # do we want templates?
)


app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def is_picture(data):
    return True

def is_word_data(data):
    return not data == "invalid_data"

def pic_model_1(data):
    return get_info(data)

def word_model_1(data):
    return classify(data)

TABULAR = 0
PICTURE = 1

models = {
    "PICTURE_MODEL1": (PICTURE, pic_model_1),
    "TITANIC_TREE"  : (TABULAR, word_model_1),
    "WORD_MODEL1"   : (TABULAR, word_model_1)
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/how-it-works')
def works():
    return render_template('works.html')

@app.route('/about')
def about():
    return render_template('about.html')


# TODO Make this random
def random_thing():
    return "128"

@app.route('/mlmodel', methods = ['POST'])
def mlmodel():
    args = request.args
    which_model = args.get("model", "PICTURE_MODEL1")
    if which_model not in models:
        return '', 418
    (model_type, model_func) = models[which_model]
    if model_type == TABULAR:
        form = request.form
        vector = json.loads(form["features"])
        print(vector)
        #vector = args.get("data", "invalid_data")
        if not is_word_data(vector):
            return '', 400
        if vector:
            (nodeID, alive_percent) = model_func(vector)
            return jsonify({
                "label": nodeID,
                "alive_percent": alive_percent
            })
    if model_type == PICTURE:
        image_file = request.files['pic']
        if not is_picture(image_file):
            return '', 410
        if image_file.filename == '':
            return '', 401
        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            filepath = os.path.join("templates", "img", "generated_heatmaps", random_thing() + filename)
            image_file.save(filepath)
            ret_file, prediction = model_func(filepath)
            #return send_file(ret_file)
            return jsonify({
                "original": filepath, 
                "heatmap": ret_file,
                "prediction": str(prediction)
            })

        return '', 402
    return model_func(test_data), 200
