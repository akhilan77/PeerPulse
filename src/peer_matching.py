import numpy as np
from sklearn.neighbors import NearestNeighbors


def find_peers(X, k=20):
    """
    Find K nearest peer districts for every district.
    The district itself is excluded.
    """
    model = NearestNeighbors(n_neighbors=k + 1, metric="euclidean")
    model.fit(X)

    distances, indices = model.kneighbors(X)

    # Remove self (first neighbour)
    return distances[:, 1:], indices[:, 1:]