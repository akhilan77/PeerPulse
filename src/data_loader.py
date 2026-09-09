import pandas as pd
from pathlib import Path


DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "raw"


def load_district_data():
    files = list(DATA_DIR.glob("ASAR_blood_banking_district_dataset*.xlsx"))

    if not files:
        raise FileNotFoundError("No ASAR district Excel file found in data/raw/")

    # Prefer the original file without "-1"
    file = next(
        (f for f in files if "-1" not in f.stem),
        files[0]
    )

    return pd.read_excel(
        file,
        sheet_name="District Level Data"
    )


def load_district_dictionary():
    files = list(DATA_DIR.glob("ASAR_blood_banking_district_dataset*.xlsx"))

    file = next(
        (f for f in files if "-1" not in f.stem),
        files[0]
    )

    return pd.read_excel(
        file,
        sheet_name="District Level Dictionary"
    )


if __name__ == "__main__":
    df = load_district_data()

    print("District data loaded successfully")
    print("Shape:", df.shape)
    print("Columns:", len(df.columns))