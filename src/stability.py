import numpy as np
from sklearn.neighbors import NearestNeighbors


def get_neighbors(X, k=20, metric="euclidean"):
    model = NearestNeighbors(
        n_neighbors=k + 1,
        metric=metric
    )
    model.fit(X)

    distances, indices = model.kneighbors(X)

    return distances[:, 1:], indices[:, 1:]


def get_primary_gaps(X, indices):
    peer_means = np.array([
        X[peers].mean(axis=0)
        for peers in indices
    ])

    gaps = X - peer_means

    return np.argmin(gaps, axis=1)


def compare_k_values(X):
    results = {}

    for k in [10, 20, 30]:
        _, indices = get_neighbors(X, k)
        results[k] = get_primary_gaps(X, indices)

    return {
        "K10_vs_K20": float(np.mean(results[10] == results[20])),
        "K30_vs_K20": float(np.mean(results[30] == results[20]))
    }


def resampling_stability(
    X,
    k=20,
    n_iterations=500,
    random_state=42
):
    """
    Test stability by resampling districts with replacement.

    This is a sensitivity analysis:
    each iteration creates a bootstrap sample of districts,
    then evaluates the resulting primary-gap labels.
    """

    rng = np.random.default_rng(random_state)

    _, base_indices = get_neighbors(X, k)
    base_labels = get_primary_gaps(X, base_indices)

    agreements = []

    for _ in range(n_iterations):

        sample_indices = rng.choice(
            len(X),
            size=len(X),
            replace=True
        )

        X_sample = X[sample_indices]

        _, sample_neighbors = get_neighbors(
            X_sample,
            k
        )

        sample_labels = get_primary_gaps(
            X_sample,
            sample_neighbors
        )

        # Compare the distribution of selected gap types
        base_distribution = np.bincount(
            base_labels,
            minlength=3
        ) / len(base_labels)

        sample_distribution = np.bincount(
            sample_labels,
            minlength=3
        ) / len(sample_labels)

        agreement = 1 - np.mean(
            np.abs(base_distribution - sample_distribution)
        )

        agreements.append(agreement)

    return {
        "mean_stability": float(np.mean(agreements)),
        "min_stability": float(np.min(agreements)),
        "max_stability": float(np.max(agreements))
    }
def compare_distance_metrics(X, k=20):
    covariance = np.cov(X, rowvar=False)
    inverse_covariance = np.linalg.pinv(covariance)

    _, euclidean_indices = get_neighbors(
        X, k, metric="euclidean"
    )

    model = NearestNeighbors(
        n_neighbors=k + 1,
        metric="mahalanobis",
        metric_params={"VI": inverse_covariance}
    )

    model.fit(X)

    _, mahalanobis_indices = model.kneighbors(X)

    mahalanobis_indices = mahalanobis_indices[:, 1:]

    euclidean_labels = get_primary_gaps(
        X, euclidean_indices
    )

    mahalanobis_labels = get_primary_gaps(
        X, mahalanobis_indices
    )

    agreement = np.mean(
        euclidean_labels == mahalanobis_labels
    )

    return float(agreement)