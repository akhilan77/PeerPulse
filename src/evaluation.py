import numpy as np


def method_agreement(peer_primary, global_primary):
    return np.mean(peer_primary == global_primary)


def stability_summary(results):
    results = np.asarray(results)

    return {
        "mean_stability": float(results.mean()),
        "min_stability": float(results.min()),
        "max_stability": float(results.max()),
    }


def permutation_pvalue(observed, null_values):
    null_values = np.asarray(null_values)

    return float(
        (np.sum(null_values >= observed) + 1)
        / (len(null_values) + 1)
    )