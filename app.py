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

models = {
    "PICTURE_MODEL1": (is_picture, pic_model_1),
    "WORD_MODEL1"   : (is_word_data, word_model_1)
}

@app.route('/')
def hello():
    name = request.args.get("name", "World")
    return 'Hello, {escape(name)}!'

@app.route('/mlmodel')
def mlmodel():
    args = request.args
    which_model = args.get("model", "not_a_model")
    test_data = args.get("data", "invalid_data")
    if which_model not in models:
        return '', 418
    (input_valid_func, model_func) = models[which_model]
    if not input_valid_func(test_data):
        return '', 400
    return model_func(test_data), 200
