from flask import Flask, escape, request, jsonify

app = Flask(__name__)


def is_picture(data):
    return data == '1'

def is_word_data(data):
    return data == '2'

def pic_model_1(data):
    return "It's a cat"

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
    name = request.args.get("name", "World")
    return 'Hello, {escape(name)}!'

@app.route('/mlmodel')
def mlmodel():
    args = request.args
    which_model = args.get("model", "not_a_model")
    if which_model not in models:
        return '', 418
    (model_type, model_func) = models[which_model]
    if model_type == WORD:
        test_data = args.get("data", "invalid_data")
        if not is_word_data(test_data):
            return '', 400
    if model_type == PICUTRE:
        image_file = request.files['image']
        if not is_picture(image_file)
            return '', 400
    return model_func(test_data), 200
