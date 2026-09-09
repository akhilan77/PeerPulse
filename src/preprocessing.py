import pandas as pd

FEATURES = [
    "bb_availaibility",
    "district_annual_per100",
    "percentage_voluntary_district",
]


def prepare_data(df):
    required = ["district_name", "state_name"] + FEATURES

    missing = [col for col in required if col not in df.columns]
    if missing:
        raise ValueError(f"Missing columns: {missing}")

    data = df[required].copy()

    before = len(data)
    data = data.dropna(subset=FEATURES)
    dropped = before - len(data)

    print(f"Rows before: {before}")
    print(f"Rows after: {len(data)}")
    print(f"Dropped: {dropped}")

    return data