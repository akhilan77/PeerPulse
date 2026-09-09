# PeerPulse AI: District-Level Blood Banking Intelligence & Peer Profiling System

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Framework](https://img.shields.io/badge/Analytics-Scikit--Learn%20%7C%20Pandas%20%7C%20NumPy-orange.svg)](https://scikit-learn.org/)
[![Data](https://img.shields.io/badge/Dataset-ASAR%20%2F%20NACO%202016-red.svg)](https://naco.gov.in/)

**PeerPulse AI** is a data-driven decision-support platform that assesses district-level blood bank performance across India. Rather than applying blunt national averages or universal rankings, PeerPulse AI benchmarks each district against a statistically comparable cohort of peer districts using multi-dimensional distance metrics.

---

## 📌 Table of Contents

- [The Core Concept](#-the-core-concept)
- [Why Peer-Relative Benchmarking?](#-why-peer-relative-benchmarking)
- [System Architecture](#-system-architecture)
- [Analytical Methodology](#-analytical-methodology)
  - [1. Data Preprocessing & Indicator Selection](#1-data-preprocessing--indicator-selection)
  - [2. Feature Standardization](#2-feature-standardization)
  - [3. KNN Peer Matching Engine](#3-knn-peer-matching-engine)
  - [4. Multi-Dimensional Gap Detection](#4-multi-dimensional-gap-detection)
  - [5. Primary Gap Diagnosis](#5-primary-gap-diagnosis)
- [Statistical Validation & Robustness](#-statistical-validation--robustness)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Quickstart: Running the Pipeline](#quickstart-running-the-pipeline)
- [Core API & Modules](#-core-api--modules)
- [Product Roadmap](#-product-roadmap)
- [Limitations & Analytical Scope](#-limitations--analytical-scope)
- [Citation & Acknowledgments](#-citation--acknowledgments)

---

## 💡 The Core Concept

Traditional public-health assessments ask:
> *"Is this district good or bad compared to the national average?"*

**PeerPulse AI** asks:
> **"How is this district performing compared to districts with similar operational characteristics, and where is its primary relative shortfall?"**

By identifying peer groups with comparable profiles, PeerPulse AI uncovers hidden vulnerabilities and targeted operational strengths across three foundational dimensions of blood banking:
1. **Blood Bank Availability** (Infrastructure density)
2. **Annual Blood Collection per 100 Population** (Collection efficiency)
3. **Percentage of Voluntary Non-Remunerated Donations** (Donor quality & community engagement)

```
                       ┌──────────────────────────────┐
                       │  Target District Assessment   │
                       └──────────────┬───────────────┘
                                      │
               ┌──────────────────────┴──────────────────────┐
               ▼                                             ▼
  ❌ National Average Benchmark              ✅ Peer-Relative Benchmark (PeerPulse)
  - Masks regional constraints              - Compares against 20 nearest peers
  - Blames systemic factors                 - Pinpoints specific operational gaps
  - One-size-fits-all targets               - Context-aware decision support
```

---

## 🎯 Why Peer-Relative Benchmarking?

Districts across India differ fundamentally in demographic density, healthcare access, and donor ecosystems. A rural district with low infrastructure cannot be meaningfully evaluated against an urban metro district.

PeerPulse AI creates an equitable baseline:
* **Context-Aware Comparison**: Evaluates districts within their statistical peer neighborhood ($K=20$).
* **Granular Gap Isolation**: Pinpoints whether a district lags in *Availability*, *Collection*, or *Voluntary Donation*.
* **Actionable Evidence**: Equips public health analysts and policy planners with targeted intelligence for localized interventions.

---

## 🏗 System Architecture

```mermaid
flowchart TD
    A[ASAR / NACO District Dataset\n616 Records, 35 States/UTs] --> B[Data Audit & Preprocessing\nMissing-value handling: 615 usable districts]
    B --> C[3 Defensible Indicators Selected\nAvailability | Collection | Voluntary %]
    C --> D[Z-Score Feature Standardization\nZero Mean, Unit Variance]
    D --> E[K-Nearest Neighbors Engine\nK=20, Euclidean Distance Metric]
    E --> F[Peer Mean & Gap Computation\nDistrict Feature - Peer Group Mean]
    F --> G[Primary Gap Diagnosis\nArgmin of Relative Standardized Gaps]
    G --> H[Statistical Validation Layer\nBootstrap Stability | Metric & K Sensitivity]
    H --> I[Decision Support Outputs\nDistrict Profiles | Gap Rankings | Comparison Views]
```

---

## 🔬 Analytical Methodology

### 1. Data Preprocessing & Indicator Selection
Out of 39 variables in the raw ASAR/NACO 2016 dataset, three quality-verified, defensible operational features were isolated:

| Feature Key | Description | Unit / Scale |
| :--- | :--- | :--- |
| `bb_availaibility` | Blood bank availability per district | Continuous metric |
| `district_annual_per100` | Total annual blood units collected per 100 population | Units / 100 pop |
| `percentage_voluntary_district` | Percentage of voluntary blood donations | Percentage ($0 - 100\%$) |

*Note: Composite assessment scores (e.g., ASAR total score) are excluded from the peer-matching feature set to prevent collinearity and target leakage.*

### 2. Feature Standardization
Because availability, collection rate, and voluntary percentage operate on vastly different scales, features are transformed via standard Z-score normalization:

$$z_{ij} = \frac{x_{ij} - \mu_j}{\sigma_j}$$

Where $\mu_j$ and $\sigma_j$ denote the global mean and standard deviation for feature $j$.

### 3. KNN Peer Matching Engine
For each district $i$, the engine computes pairwise Euclidean distances in the standardized 3D feature space:

$$d(u, v) = \sqrt{\sum_{j=1}^{3} (u_j - v_j)^2}$$

The $K=20$ nearest districts (excluding the query district itself) form the peer set $\mathcal{P}_i$.

### 4. Multi-Dimensional Gap Detection
The peer group baseline is computed as the centroid of the peer set:

$$\bar{x}_{\mathcal{P}_i, j} = \frac{1}{K} \sum_{k \in \mathcal{P}_i} x_{k, j}$$

The peer-relative gap $\Delta_{i, j}$ is defined as:

$$\Delta_{i, j} = x_{i, j} - \bar{x}_{\mathcal{P}_i, j}$$

* $\Delta_{i, j} > 0$: Performing **above** peer average
* $\Delta_{i, j} < 0$: Performing **below** peer average (Shortfall)

### 5. Primary Gap Diagnosis
The primary area of concern corresponds to the dimension exhibiting the strongest relative deficit:

$$\text{Primary Gap}_i = \arg\min_{j \in \{\text{Availability, Collection, Voluntary}\}} \Delta_{i, j}$$

---

## 📊 Statistical Validation & Robustness

To ensure that the methodology produces reliable, non-arbitrary signals, the pipeline underwent rigorous sensitivity and stability tests:

| Validation Test | Configuration | Result | Interpretation |
| :--- | :--- | :--- | :--- |
| **Resampling Stability** | $N=500$ Bootstrap Iterations | **98.16% Mean Stability** (Min: 95.01%, Max: 99.89%) | Gap distributions remain exceptionally robust under district sampling variations. |
| **$K$-Parameter Sensitivity** | $K=10\text{ vs }K=20$ | **74.80% Agreement** | Moderate neighborhood flexibility while maintaining core diagnosis. |
| **$K$-Parameter Sensitivity** | $K=30\text{ vs }K=20$ | **86.34% Agreement** | High consistency as peer neighborhood expands; confirms $K=20$ as optimal baseline. |
| **Distance Metric Sensitivity** | Euclidean vs. Mahalanobis | **80.00% Agreement** | Euclidean metric is reliable while accounting for inter-feature covariance. |
| **Method Agreement Check** | Peer-Relative vs. Global Z | **96.59% Agreement** | Diagnoses remain consistent with macro distributions while surfacing local anomalies. |

---

## 📁 Repository Structure

```text
PeerPulse-AI/
├── data/
│   ├── raw/                  # Original ASAR/NACO district & state Excel datasets
│   └── processed/            # Preprocessed datasets & cached matrices
├── src/
│   ├── __init__.py
│   ├── data_loader.py        # Dataset ingestion & Excel sheet parsing
│   ├── preprocessing.py      # Column validation, filtering, & missing data handling
│   ├── peer_matching.py      # Scikit-learn KNN engine (K=20, Euclidean)
│   ├── gap_detection.py      # Peer-mean calculation & primary gap classification
│   ├── stability.py          # Resampling stability & distance sensitivity tests
│   └── evaluation.py         # Agreement scoring & permutation testing utilities
├── notebooks/
│   ├── 01_data_audit.ipynb   # Exploratory data audit, distributions, & correlations
│   ├── 04_validation.ipynb   # Robustness, sensitivity, and stability experiments
│   └── 05_results.ipynb      # Final result tables and visual diagnostics
├── docs/
│   └── methodology.md        # Detailed mathematical & methodological documentation
├── outputs/
│   ├── figures/              # Diagnostic distribution plots & heatmaps
│   ├── profiles/             # Exported district-level profile summaries
│   └── tables/               # Gap rankings and CSV summary outputs
├── tests/                    # Unit tests for data loading and calculations
├── prd.md                    # Comprehensive Product Requirements Document (PRD)
├── requirements.txt          # Python dependencies
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
* Python 3.10 or higher
* `pip` and virtual environment support (`venv`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/PeerPulse-AI.git
   cd PeerPulse-AI
   ```

2. **Create and activate a virtual environment:**
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

---

### Quickstart: Running the Pipeline

You can run the core analytical pipeline directly from Python:

```python
from src.data_loader import load_district_data
from src.preprocessing import prepare_data, FEATURES
from src.peer_matching import find_peers
from src.gap_detection import create_gap_table, identify_primary_gap
from sklearn.preprocessing import StandardScaler

# 1. Load data
raw_df = load_district_data()

# 2. Clean and select features
df = prepare_data(raw_df)

# 3. Standardize features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df[FEATURES])

# 4. Identify 20 nearest peers
distances, peer_indices = find_peers(X_scaled, k=20)

# 5. Compute gaps and diagnose primary gap
gap_table = create_gap_table(df, X_scaled, peer_indices)
results = identify_primary_gap(gap_table)

# Display sample results
print(results[["district_name", "state_name", "primary_gap", "primary_gap_z"]].head(10))
```

---

## 🧩 Core API & Modules

* **`src.data_loader`**:
  * `load_district_data()`: Ingests the ASAR district-level dataset from `data/raw/`.
  * `load_district_dictionary()`: Ingests variable descriptions and metadata.
* **`src.preprocessing`**:
  * `prepare_data(df)`: Validates required columns, removes nulls across core features, and returns clean $615 \times 3$ modeling data.
* **`src.peer_matching`**:
  * `find_peers(X, k=20)`: Fits `NearestNeighbors` and retrieves nearest peer indices and distance metrics.
* **`src.gap_detection`**:
  * `calculate_gaps(X, peer_indices)`: Calculates directional gaps against peer cluster means.
  * `identify_primary_gap(gap_table)`: Determines the primary shortfall dimension and standardized gap score.
* **`src.stability`**:
  * `compare_k_values(X)`: Evaluates model consistency across $K \in \{10, 20, 30\}$.
  * `resampling_stability(X, n_iterations=500)`: Evaluates bootstrap label stability.
  * `compare_distance_metrics(X)`: Computes agreement between Euclidean and Mahalanobis distances.

---

## 🗺 Product Roadmap

- [x] **Phase 1: Analytical Intelligence Engine**
  - [x] Data audit & quality verification
  - [x] Feature selection & standardization pipeline
  - [x] KNN peer-matching engine ($K=20$)
  - [x] Gap detection & primary gap diagnostic algorithm
  - [x] Sensitivity, stability, and validation layer
- [ ] **Phase 2: REST API & Precomputed Backend**
  - [ ] FastAPI backend service (`/api/districts`, `/api/districts/{id}/peers`, `/api/summary`)
  - [ ] SQLite / PostgreSQL caching for instant profile retrieval
- [ ] **Phase 3: Interactive Decision-Support Web UI**
  - [ ] District Explorer with auto-complete search
  - [ ] Interactive radar & gap deviation charts
  - [ ] Multi-district comparative analysis view
  - [ ] PDF report export for public-health administrators
- [ ] **Phase 4: Advanced Temporal & Ingestion Upgrades**
  - [ ] Multi-year trend analysis (as subsequent NACO datasets release)
  - [ ] State-level aggregation and macro policy simulation

---

## ⚠️ Limitations & Analytical Scope

1. **Historical Cross-Sectional Data**: This version utilizes the ASAR/NACO 2016 dataset. Results reflect operational baselines from that period.
2. **Non-Causal Analytical Signal**: PeerPulse AI provides **descriptive and comparative signals**, not causal proof. A primary gap does not indicate the underlying sociological or clinical cause of a deficiency.
3. **Model Selection**: $K=20$ with Euclidean distance is an empirically validated configuration for this dataset, but local context should always accompany data-driven conclusions.
4. **Scope Boundaries**: PeerPulse AI is not intended for real-time blood inventory tracking, emergency donor dispatch, or patient-level diagnosis.

---

## 📜 Citation & Acknowledgments

* **Data Provider**: National AIDS Control Organisation (NACO) / ASAR Blood Banking Dataset.
* **Purpose**: Developed for academic research, health systems evaluation, and evidence-based public health planning.

```bibtex
@software{peerpulse_ai_2026,
  author = {PeerPulse AI Team},
  title = {PeerPulse AI: District-Level Blood Banking Intelligence & Peer Profiling System},
  year = {2026},
  url = {https://github.com/your-username/PeerPulse-AI}
}
```
