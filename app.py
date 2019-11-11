from flask import Flask, escape, request, jsonify, render_template, send_file
from werkzeug.utils import secure_filename
import os
from mnist_cnn import get_info

UPLOAD_FOLDER = 'uploaded_images';
ALLOWED_EXTENSIONS = {'png'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def is_picture(data):
    return True

def is_word_data(data):
    return data == '2'

def pic_model_1(data):
    return get_info(data)

def word_model_1(data):
    return "The house should cost one million dollars"

WORD = 0
PICTURE = 1

models = {
    "PICTURE_MODEL1": (PICTURE, pic_model_1),
    "WORD_MODEL1"   : (WORD, word_model_1)
}

@app.route('/')
def hello():
    #name = request.args.get("name", "World")
    return render_template('index.html')

# TODO Make this random
def random_thing():
    return "128"

@app.route('/mlmodel', methods = ['POST', 'GET'])
def mlmodel():
    args = request.args
    which_model = args.get("model", "PICTURE_MODEL1")
    if which_model not in models:
        return '', 418
    (model_type, model_func) = models[which_model]
    if model_type == WORD:
        image_file = args.get("data", "invalid_data")
        if not is_word_data(test_data):
            return '', 400
    if model_type == PICTURE:
        image_file = request.files['pic']
        if not is_picture(image_file):
            return '', 410
        if image_file.filename == '':
            return '', 401
        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], random_thing() + filename)
            image_file.save(filepath)
            ret_file = model_func(filepath)
            print(ret_file)
            return send_file(ret_file)
        return '', 402
    return model_func(test_data), 200
