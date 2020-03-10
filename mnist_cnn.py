import image_processing as ip
import numpy as np
from PIL import Image

def gen_heatmap(model, image, filename, adv=False):
    target = np.argmax(model.predict(image.reshape(1, 28, 28, 1)))
    print(target)
    misses = np.zeros((28, 28), dtype="float32")
    gen = ip.GrayscalePerturbator(image, grid_dimen=1, stride=1, stride_scale=1, cutoff_dimen=28, is_adversarial=adv)
    for pert in gen:
        label = np.argmax(model.predict(pert.reshape(1, 28, 28, 1)))
        if ((not adv) and label == target) or (adv and label != target):
            indices = gen.maskedIndices
            for index in indices:
                r, c, grid_dimen = index
                misses[r][c] += 1.0 / (grid_dimen ** 2)
        else:
            pass
    
    maxMiss = np.max(misses)
    if maxMiss != 0:
        scaled = np.array(misses * (255.0 / maxMiss), dtype="uint8")
    else:
        scaled = np.array(misses, dtype="uint8")

    i = Image.fromarray(scaled, mode="L")
    i.save(filename)
    return filename, target



def get_info(image_file):
    image = np.array(Image.open(image_file))
    model = ip.get_pretrained_mnist_cnn()
    return gen_heatmap(model, image, image_file + "heatmap.png")


#filename = "file.png"
#mnister(filename)
"""

from keras.datasets import mnist
(x_train, y_train), (x_test, y_test) = mnist.load_data()
x= x_train[1]
i = Image.fromarray(x, mode="L")
i.save("1.png")
"""
