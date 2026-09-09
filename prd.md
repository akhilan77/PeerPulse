# PRD — PeerPulse AI

**Product:** PeerPulse AI
**Version:** 1.0
**Status:** Development
**Product Type:** Data-driven decision-support web application
**Primary Domain:** District-level blood-bank service assessment in India

---

## 1. Product Overview

**PeerPulse AI** analyzes district-level blood-bank data and identifies service gaps by comparing each district with a set of statistically similar districts.

Instead of asking:

> "Is this district good or bad?"

the system asks:

> **"How is this district performing compared with similar districts?"**

The system generates a district profile showing:

* Blood-bank availability
* Blood collection performance
* Voluntary donation performance
* Peer-relative gaps
* Primary area of concern
* Peer comparison
* Stability/robustness information

---

# 2. Problem Statement

District blood-bank performance varies substantially across India.

A simple national average can hide important differences because districts differ in their underlying characteristics.

PeerPulse AI addresses this by creating **peer groups of comparable districts** and measuring each district's performance relative to those peers.

The system is intended to help users identify **where a district underperforms relative to comparable districts and which service dimension deserves attention.**

---

# 3. Product Goal

### Primary Goal

Build a web application that transforms the ASAR/NACO blood-bank datasets into an understandable **district-level peer-relative profiling system**.

### Success Criteria

The application should allow a user to:

1. Select a district.
2. View its profile.
3. See its peer group.
4. See performance relative to peers.
5. Identify the largest service gap.
6. Understand the evidence behind the result.
7. Compare districts.
8. Export results for reporting.

---

# 4. Target Users

### Primary Users

**Researchers / Students**

* Analyze district-level blood-bank patterns.
* Generate evidence for research and reports.

**Policy / Public-health Analysts**

* Identify districts requiring attention.
* Compare districts with similar characteristics.

**Program Managers**

* Understand relative performance across service dimensions.

### Secondary Users

**Academic Evaluators**

* Review methodology and validation.

**Decision Makers**

* Consume summarized district profiles rather than raw datasets.

---

# 5. Data Sources

The initial system uses the **ASAR/NACO 2016 blood-banking datasets**.

### District Dataset

* 616 original rows
* 615 usable districts after preprocessing
* 35 states/UTs
* 39 variables

### State Dataset

* 35 states/UTs
* 304 variables

The initial peer-relative model uses the district-level dataset.

The state dataset is retained for potential future analysis and contextual comparison.

---

# 6. Core Features

## 6.1 District Search

User can search/select a district.

Example:

```text
District: Ajmer
State: Rajasthan
```

The system retrieves the corresponding profile.

---

## 6.2 District Profile

The profile displays:

### Basic Information

```text
District
State
Peer Group Size
```

### Key Indicators

```text
Blood-bank Availability
Annual Collection per 100 Population
Voluntary Donation %
Assessment Score
```

---

# 7. Peer Matching Engine

The system creates a peer group using **K-Nearest Neighbors (KNN)**.

### Frozen Model Configuration

```text
Features = 3
K = 20
Primary distance = Euclidean
```

The three model features are:

```text
bb_availaibility
district_annual_per100
percentage_voluntary_district
```

The features are standardized before calculating distances.

Each district is compared against its **20 nearest peer districts**.

---

# 8. Gap Detection

For every district, the system calculates the difference between its performance and the corresponding peer-group performance.

Three principal dimensions are evaluated:

### Availability

```text
District availability
vs
Peer availability
```

### Collection

```text
District annual collection per 100
vs
Peer collection
```

### Voluntary Donation

```text
District voluntary donation %
vs
Peer voluntary donation %
```

The system then identifies the dimension with the strongest relative shortfall.

---

# 9. Primary Gap

The application should clearly display:

> **Primary Gap**

Example:

```text
Primary Gap
↓
Availability
```

Possible values:

```text
Availability
Collection
Voluntary Donation
```

However, the application should **not present the primary-gap label as proof of a causal problem**.

It is a peer-relative analytical signal.

---

# 10. Statistical / Robustness Layer

The system includes validation and sensitivity analysis.

### K Sensitivity

Current results:

```text
K=10 vs K=20 → 74.80%
K=30 vs K=20 → 86.34%
```

Therefore:

> K=20 is retained as the primary configuration.

---

### Resampling Stability

Current result:

```text
Mean stability → 98.16%
Minimum → 95.01%
Maximum → 99.89%
```

This supports the stability of the **overall gap-type distribution** under district resampling.

---

### Distance Sensitivity

Current result:

```text
Euclidean vs Mahalanobis → 80%
```

Therefore:

```text
Euclidean = primary method
Mahalanobis = sensitivity analysis
```

---

# 11. Dashboard

The main dashboard should provide an overview of the dataset.

### Dashboard Components

**Total Districts**

```text
615
```

**States/UTs**

```text
35
```

**Districts by Primary Gap**

```text
Availability
Collection
Voluntary Donation
```

### Visualizations

Recommended:

* Primary-gap distribution
* State-wise gap distribution
* Availability distribution
* Collection distribution
* Voluntary donation distribution
* Peer-relative gap ranking

---

# 12. District Comparison

User should be able to select two or more districts.

Example:

```text
Ajmer vs Sirsa vs Jalpaiguri
```

The application compares:

| Metric             | Ajmer | Sirsa | Jalpaiguri |
| ------------------ | ----: | ----: | ---------: |
| Availability       |     — |     — |          — |
| Collection         |     — |     — |          — |
| Voluntary Donation |     — |     — |          — |
| Primary Gap        |     — |     — |          — |

---

# 13. Peer Group View

For a selected district, display:

```text
Selected District
       ↓
20 Comparable Districts
       ↓
Peer Performance
       ↓
District vs Peer Difference
```

The user should be able to see which districts were considered peers.

---

# 14. Ranking

The application may provide rankings such as:

### Largest Availability Shortfalls

```text
1. District A
2. District B
3. District C
```

### Largest Collection Shortfalls

```text
1. District A
2. District B
3. District C
```

### Largest Voluntary Donation Shortfalls

```text
1. District A
2. District B
3. District C
```

Rankings should clearly state that they are **peer-relative**, not absolute national rankings.

---

# 15. Frontend Requirements

The frontend should be simple and research-oriented.

### Main Pages

```text
/
Dashboard

/districts
District Explorer

/district/:id
District Profile

/compare
District Comparison

/methodology
Methodology & Validation
```

---

## Dashboard UI

```text
------------------------------------------------
 PeerPulse AI
 District Blood-Bank Intelligence
------------------------------------------------

 [ Search District......................... ]

 615 Districts      35 States

 ----------------------------------------------
 Primary Gap Distribution
 ----------------------------------------------

 [Availability] [Collection] [Voluntary]

 ----------------------------------------------
 Top Peer-Relative Gaps
 ----------------------------------------------

 District | State | Primary Gap | Gap Score
```

---

# 16. Backend Architecture

```text
                    ┌──────────────────┐
                    │   ASAR / NACO    │
                    │     Dataset      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Data Loader      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Preprocessing    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Standardization  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ KNN Peer Engine  │
                    │      K = 20      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Gap Detection    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Validation /     │
                    │ Stability        │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Backend API      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    Frontend      │
                    └──────────────────┘
```

---

# 17. Backend API

The eventual API should expose endpoints such as:

```text
GET /api/districts
```

Returns district list.

```text
GET /api/districts/{id}
```

Returns district profile.

```text
GET /api/districts/{id}/peers
```

Returns 20 peer districts.

```text
GET /api/districts/{id}/gaps
```

Returns peer-relative gaps.

```text
GET /api/summary
```

Returns dashboard statistics.

```text
GET /api/validation
```

Returns model-validation results.

---

# 18. Processing Pipeline

```text
Raw Excel
   ↓
Data Loading
   ↓
Data Audit
   ↓
Missing-value handling
   ↓
Feature Selection
   ↓
Standardization
   ↓
KNN Peer Matching
   ↓
Peer Mean Calculation
   ↓
Gap Calculation
   ↓
Primary Gap Detection
   ↓
Validation
   ↓
Processed Results
   ↓
API
   ↓
Frontend
```

---

# 19. Technology Stack

### Data / ML

```text
Python
Pandas
NumPy
SciPy
Scikit-learn
Statsmodels
```

### Visualization

```text
Matplotlib
Seaborn
```

### Backend

Recommended:

```text
FastAPI
```

### Frontend

Recommended:

```text
Next.js
React
TypeScript
```

### Database

For the prototype:

```text
SQLite
```

Later:

```text
PostgreSQL
```

---

# 20. Project Structure

```text
PeerPulse-AI/
│
├── data/
│   ├── raw/
│   └── processed/
│
├── notebooks/
│   ├── 01_data_audit.ipynb
│   ├── 02_feature_engineering.ipynb
│   ├── 03_peer_model.ipynb
│   ├── 04_validation.ipynb
│   └── 05_results.ipynb
│
├── src/
│   ├── data_loader.py
│   ├── preprocessing.py
│   ├── peer_matching.py
│   ├── gap_detection.py
│   ├── stability.py
│   └── evaluation.py
│
├── tests/
│
├── outputs/
│   ├── profiles/
│   ├── figures/
│   └── tables/
│
├── app/
│
├── docs/
│   └── methodology.md
│
├── requirements.txt
├── README.md
└── .gitignore
```

---

# 21. Non-Functional Requirements

### Performance

District profile should load quickly after the ML calculations have been precomputed.

### Reproducibility

The same dataset and frozen parameters should produce reproducible results.

### Explainability

Every primary-gap result should be traceable to:

```text
District data
+
Peer group
+
Peer statistics
+
Gap calculation
```

### Transparency

The application must expose methodology and limitations.

---

# 22. Limitations

The application must explicitly communicate:

* Dataset is from **2016**.
* Data is cross-sectional.
* Analysis is district-level.
* Peer-relative gaps do **not establish causality**.
* A gap does not automatically mean a district requires a particular intervention.
* K=20 is the selected model configuration, not a universally optimal value.
* Distance-metric sensitivity exists.
* Missing data required preprocessing.

---

# 23. Out of Scope — Version 1

Do **not** build these initially:

* Real-time blood-bank inventory
* Blood donor matching
* Hospital emergency management
* Blood demand forecasting
* Patient-level prediction
* Medical diagnosis
* Automated policy recommendations
* Causal inference
* Live NACO integration

These would turn the project into a substantially different system.

---

# 24. Future Versions

### V2

* State-level comparison
* More demographic/contextual features
* Interactive peer visualization
* PDF report generation

### V3

* Time-series data
* Blood shortage forecasting
* Real-time inventory integration
* Alert system

### V4

* Advanced ML models
* Explainable AI
* Policy simulation
* Federated/multi-institution learning if suitable data becomes available

---

# 25. MVP Definition

The MVP is **not** "a fancy frontend."

The MVP is:

> **A working system that takes the ASAR/NACO district dataset, creates 20 comparable peers for each district, calculates peer-relative gaps across the three frozen dimensions, identifies the primary gap, validates the methodology, and exposes those results through a usable web interface.**

### MVP completion checklist

* [x] Dataset loaded
* [x] Data audit
* [x] Missing-data handling
* [x] 3 features frozen
* [x] Standardization
* [x] KNN peer engine
* [x] K=20 selected
* [x] Gap calculation
* [x] Primary-gap detection
* [x] K sensitivity analysis
* [x] Resampling stability analysis
* [x] Mahalanobis sensitivity analysis
* [ ] Final validation notebook
* [ ] Final results tables
* [ ] Backend API
* [ ] Frontend dashboard
* [ ] District profile
* [ ] Peer visualization
* [ ] Testing
* [ ] Deployment

---

## The actual development path from here

We're **past the basic data/ML setup** now. The next sequence should be:

```text
04_validation.ipynb
        ↓
05_results.ipynb
        ↓
Freeze ML outputs
        ↓
FastAPI backend
        ↓
Next.js frontend
        ↓
Connect frontend ↔ backend
        ↓
Testing
        ↓
Deploy
```

So yes — **the data setup we've been doing is the training/analysis/backend intelligence phase.** The frontend and API come after we freeze the analytical pipeline.
