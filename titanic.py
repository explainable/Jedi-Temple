import tabular as tab
import numpy as np

tit_depth = 5
clf, feat_names, pred_labels, deciPath = tab.treeTitanic(tit_depth)

def classify(vector):
    np_vector = np.array(vector).reshape(1, -1)
    node = tab.getNode(np_vector, clf, deciPath, feat_names)
    al_per = clf.predict_proba(np_vector)
    return (node, al_per[0, 1])

#x, y = classify(np.array([1.0, 1.0, 1.0, 1.0, 1.0, 1.0]).reshape(1, -1))
#print(x)
#print(y)
