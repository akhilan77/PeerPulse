import numpy as np
import pandas as pd


FEATURE_NAMES = {
    "bb_availaibility": "Availability",
    "district_annual_per100": "Collection",
    "percentage_voluntary_district": "Voluntary Donation",
}


def calculate_gaps(X, peer_indices):
    """
    Calculate each district's gap from the mean of its peer group.
    Positive = above peers
    Negative = below peers
    """
    peer_means = np.array([
        X[peers].mean(axis=0)
        for peers in peer_indices
    ])

    return X - peer_means


def create_gap_table(df, X, peer_indices):
    gaps = calculate_gaps(X, peer_indices)

    result = df[["district_name", "state_name"]].copy()

    result["availability_gap"] = gaps[:, 0]
    result["collection_gap"] = gaps[:, 1]
    result["voluntary_gap"] = gaps[:, 2]

    return result


def identify_primary_gap(gap_table):
    gap_columns = [
        "availability_gap",
        "collection_gap",
        "voluntary_gap",
    ]

    result = gap_table.copy()

    # Most negative dimension = biggest relative weakness
    result["primary_gap"] = (
        result[gap_columns]
        .idxmin(axis=1)
        .map({
            "availability_gap": "Availability",
            "collection_gap": "Collection",
            "voluntary_gap": "Voluntary Donation",
        })
    )

    result["primary_gap_z"] = result[gap_columns].min(axis=1)

    return result