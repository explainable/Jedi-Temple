import tabular as tab
import numpy as np

clf, feat_names, deciPath = tab.loadTitanicTree()

def classify(vector):
    np_vector = np.array(vector).reshape(1, -1)
    node = tab.getNode(vector, clf, deciPath, feat_names)
    al_per = clf.predict_proba(np_vector)
    return (node, al_per[0, 1])

#x, y = classify(np.array([1.0, 1.0, 1.0, 1.0, 1.0, 1.0]).reshape(1, -1))
#print(x)
#print(y)
