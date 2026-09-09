import json
import re
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import NearestNeighbors
from data_loader import load_district_data
from preprocessing import prepare_data, FEATURES
from stability import compare_k_values, resampling_stability, compare_distance_metrics, get_neighbors, get_primary_gaps

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def main():
    print("Loading raw district dataset...")
    raw_df = load_district_data()
    clean_df = prepare_data(raw_df).reset_index(drop=True)
    
    n_districts = len(clean_df)
    print(f"Total usable districts: {n_districts}")
    
    # Extract features
    X_raw = clean_df[FEATURES].values
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_raw)
    
    # Feature stats for national context
    national_stats = {
        "availability": {
            "mean": float(np.mean(X_raw[:, 0])),
            "std": float(np.std(X_raw[:, 0])),
            "median": float(np.median(X_raw[:, 0])),
            "min": float(np.min(X_raw[:, 0])),
            "max": float(np.max(X_raw[:, 0]))
        },
        "collection": {
            "mean": float(np.mean(X_raw[:, 1])),
            "std": float(np.std(X_raw[:, 1])),
            "median": float(np.median(X_raw[:, 1])),
            "min": float(np.min(X_raw[:, 1])),
            "max": float(np.max(X_raw[:, 1]))
        },
        "voluntary": {
            "mean": float(np.mean(X_raw[:, 2])),
            "std": float(np.std(X_raw[:, 2])),
            "median": float(np.median(X_raw[:, 2])),
            "min": float(np.min(X_raw[:, 2])),
            "max": float(np.max(X_raw[:, 2]))
        }
    }
    
    # K=20 Peer Matching (Base Model)
    k = 20
    model = NearestNeighbors(n_neighbors=k + 1, metric="euclidean")
    model.fit(X_scaled)
    distances_all, indices_all = model.kneighbors(X_scaled)
    
    peer_distances = distances_all[:, 1:]
    peer_indices = indices_all[:, 1:]
    
    # Calculate Gaps
    peer_means_scaled = np.array([
        X_scaled[peers].mean(axis=0)
        for peers in peer_indices
    ])
    peer_means_raw = np.array([
        X_raw[peers].mean(axis=0)
        for peers in peer_indices
    ])
    
    gaps_z = X_scaled - peer_means_scaled # [availability_gap_z, collection_gap_z, voluntary_gap_z]
    
    gap_labels_map = {0: "Availability", 1: "Collection", 2: "Voluntary Donation"}
    primary_gap_indices = np.argmin(gaps_z, axis=1)
    primary_gaps = [gap_labels_map[idx] for idx in primary_gap_indices]
    primary_gap_z_scores = [float(gaps_z[i, primary_gap_indices[i]]) for i in range(n_districts)]
    
    # K=10 & K=30 labels for district-level robustness
    _, k10_indices = get_neighbors(X_scaled, k=10)
    k10_labels = get_primary_gaps(X_scaled, k10_indices)
    
    _, k30_indices = get_neighbors(X_scaled, k=30)
    k30_labels = get_primary_gaps(X_scaled, k30_indices)
    
    # Mahalanobis labels
    cov = np.cov(X_scaled, rowvar=False)
    inv_cov = np.linalg.pinv(cov)
    mah_model = NearestNeighbors(n_neighbors=k + 1, metric="mahalanobis", metric_params={"VI": inv_cov})
    mah_model.fit(X_scaled)
    _, mah_indices = mah_model.kneighbors(X_scaled)
    mah_labels = get_primary_gaps(X_scaled, mah_indices[:, 1:])
    
    # Generate unique slugs
    clean_df["id"] = clean_df.apply(lambda r: slugify(f"{r['district_name']}-{r['state_name']}"), axis=1)
    
    # Handle any duplicate slugs if any
    seen = {}
    unique_ids = []
    for s in clean_df["id"]:
        if s in seen:
            seen[s] += 1
            unique_ids.append(f"{s}-{seen[s]}")
        else:
            seen[s] = 1
            unique_ids.append(s)
    clean_df["id"] = unique_ids
    
    # Build district objects
    districts = []
    for i in range(n_districts):
        row = clean_df.iloc[i]
        
        # 20 peers
        peers_list = []
        for rank, (peer_idx, dist) in enumerate(zip(peer_indices[i], peer_distances[i]), start=1):
            p_row = clean_df.iloc[peer_idx]
            peers_list.append({
                "rank": rank,
                "id": p_row["id"],
                "district_name": str(p_row["district_name"]),
                "state_name": str(p_row["state_name"]),
                "distance": round(float(dist), 4),
                "raw_metrics": {
                    "availability": round(float(X_raw[peer_idx, 0]), 3),
                    "collection": round(float(X_raw[peer_idx, 1]), 3),
                    "voluntary": round(float(X_raw[peer_idx, 2]), 2),
                }
            })
            
        dist_obj = {
            "id": row["id"],
            "district_name": str(row["district_name"]),
            "state_name": str(row["state_name"]),
            "raw_metrics": {
                "availability": round(float(X_raw[i, 0]), 3),
                "collection": round(float(X_raw[i, 1]), 3),
                "voluntary": round(float(X_raw[i, 2]), 2),
            },
            "scaled_metrics": {
                "availability": round(float(X_scaled[i, 0]), 4),
                "collection": round(float(X_scaled[i, 1]), 4),
                "voluntary": round(float(X_scaled[i, 2]), 4),
            },
            "peer_means_raw": {
                "availability": round(float(peer_means_raw[i, 0]), 3),
                "collection": round(float(peer_means_raw[i, 1]), 3),
                "voluntary": round(float(peer_means_raw[i, 2]), 2),
            },
            "peer_means_scaled": {
                "availability": round(float(peer_means_scaled[i, 0]), 4),
                "collection": round(float(peer_means_scaled[i, 1]), 4),
                "voluntary": round(float(peer_means_scaled[i, 2]), 4),
            },
            "gaps_z": {
                "availability": round(float(gaps_z[i, 0]), 4),
                "collection": round(float(gaps_z[i, 1]), 4),
                "voluntary": round(float(gaps_z[i, 2]), 4),
            },
            "raw_gaps": {
                "availability": round(float(X_raw[i, 0] - peer_means_raw[i, 0]), 3),
                "collection": round(float(X_raw[i, 1] - peer_means_raw[i, 1]), 3),
                "voluntary": round(float(X_raw[i, 2] - peer_means_raw[i, 2]), 2),
            },
            "primary_gap": primary_gaps[i],
            "primary_gap_z": round(primary_gap_z_scores[i], 4),
            "robustness": {
                "is_stable_k10": bool(k10_labels[i] == primary_gap_indices[i]),
                "k10_primary_gap": gap_labels_map[k10_labels[i]],
                "is_stable_k30": bool(k30_labels[i] == primary_gap_indices[i]),
                "k30_primary_gap": gap_labels_map[k30_labels[i]],
                "is_stable_mahalanobis": bool(mah_labels[i] == primary_gap_indices[i]),
                "mahalanobis_primary_gap": gap_labels_map[mah_labels[i]],
            },
            "peers": peers_list
        }
        districts.append(dist_obj)
        
    # State-level breakdown
    states_dict = {}
    for d in districts:
        st = d["state_name"]
        if st not in states_dict:
            states_dict[st] = {
                "state_name": st,
                "district_count": 0,
                "gap_counts": {"Availability": 0, "Collection": 0, "Voluntary Donation": 0},
                "availability_sum": 0.0,
                "collection_sum": 0.0,
                "voluntary_sum": 0.0
            }
        states_dict[st]["district_count"] += 1
        states_dict[st]["gap_counts"][d["primary_gap"]] += 1
        states_dict[st]["availability_sum"] += d["raw_metrics"]["availability"]
        states_dict[st]["collection_sum"] += d["raw_metrics"]["collection"]
        states_dict[st]["voluntary_sum"] += d["raw_metrics"]["voluntary"]
        
    state_breakdown = []
    for st, data in sorted(states_dict.items()):
        cnt = data["district_count"]
        state_breakdown.append({
            "state_name": st,
            "district_count": cnt,
            "gap_counts": data["gap_counts"],
            "averages": {
                "availability": round(data["availability_sum"] / cnt, 3),
                "collection": round(data["collection_sum"] / cnt, 3),
                "voluntary": round(data["voluntary_sum"] / cnt, 2),
            }
        })
        
    # Validation / Robustness calculations
    print("Calculating system-wide validation & stability statistics...")
    k_res = compare_k_values(X_scaled)
    mah_res = compare_distance_metrics(X_scaled)
    resamp_res = resampling_stability(X_scaled, n_iterations=300)
    
    validation_stats = {
        "k_sensitivity": {
            "k10_vs_k20": round(k_res["K10_vs_K20"] * 100, 2),
            "k30_vs_k20": round(k_res["K30_vs_K20"] * 100, 2),
            "selected_k": 20
        },
        "distance_sensitivity": {
            "euclidean_vs_mahalanobis": round(mah_res * 100, 2),
            "primary_metric": "euclidean"
        },
        "resampling_stability": {
            "mean_stability": round(resamp_res["mean_stability"] * 100, 2),
            "min_stability": round(resamp_res["min_stability"] * 100, 2),
            "max_stability": round(resamp_res["max_stability"] * 100, 2),
            "iterations": 300
        }
    }
    
    # Top shortfalls for rankings
    top_shortfalls = {
        "availability": sorted(
            [{"id": d["id"], "district_name": d["district_name"], "state_name": d["state_name"], "gap_z": d["gaps_z"]["availability"], "raw_val": d["raw_metrics"]["availability"], "peer_mean": d["peer_means_raw"]["availability"]} for d in districts],
            key=lambda x: x["gap_z"]
        )[:15],
        "collection": sorted(
            [{"id": d["id"], "district_name": d["district_name"], "state_name": d["state_name"], "gap_z": d["gaps_z"]["collection"], "raw_val": d["raw_metrics"]["collection"], "peer_mean": d["peer_means_raw"]["collection"]} for d in districts],
            key=lambda x: x["gap_z"]
        )[:15],
        "voluntary": sorted(
            [{"id": d["id"], "district_name": d["district_name"], "state_name": d["state_name"], "gap_z": d["gaps_z"]["voluntary"], "raw_val": d["raw_metrics"]["voluntary"], "peer_mean": d["peer_means_raw"]["voluntary"]} for d in districts],
            key=lambda x: x["gap_z"]
        )[:15],
    }
    
    # Gap counts overall
    gap_counts = {
        "Availability": sum(1 for d in districts if d["primary_gap"] == "Availability"),
        "Collection": sum(1 for d in districts if d["primary_gap"] == "Collection"),
        "Voluntary Donation": sum(1 for d in districts if d["primary_gap"] == "Voluntary Donation"),
    }
    
    summary_stats = {
        "total_districts": n_districts,
        "total_states": len(state_breakdown),
        "gap_counts": gap_counts,
        "national_stats": national_stats,
        "state_breakdown": state_breakdown,
        "validation_stats": validation_stats,
        "top_shortfalls": top_shortfalls,
        "features": ["bb_availaibility", "district_annual_per100", "percentage_voluntary_district"],
        "dataset_year": 2016,
        "data_source": "ASAR / NACO Blood Banking Dataset"
    }
    
    # Write output JSONs to both data/processed and public/data for web app access
    processed_dir = Path(__file__).resolve().parent.parent / "data" / "processed"
    processed_dir.mkdir(parents=True, exist_ok=True)
    
    public_data_dir = Path(__file__).resolve().parent.parent / "public" / "data"
    public_data_dir.mkdir(parents=True, exist_ok=True)
    
    for d in [processed_dir, public_data_dir]:
        with open(d / "districts.json", "w", encoding="utf-8") as f:
            json.dump(districts, f, indent=2)
        with open(d / "summary.json", "w", encoding="utf-8") as f:
            json.dump(summary_stats, f, indent=2)
            
    print("Successfully generated districts.json and summary.json in data/processed/ and public/data/")
    print(f"Summary counts: {gap_counts}")
    print(f"Validation: {validation_stats}")

if __name__ == "__main__":
    main()
