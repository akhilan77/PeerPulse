export interface RawMetrics {
  availability: number;
  collection: number;
  voluntary: number;
}

export interface ScaledMetrics {
  availability: number;
  collection: number;
  voluntary: number;
}

export interface PeerInfo {
  rank: number;
  id: string;
  district_name: string;
  state_name: string;
  distance: number;
  raw_metrics: RawMetrics;
}

export interface RobustnessMetrics {
  is_stable_k10: boolean;
  k10_primary_gap: string;
  is_stable_k30: boolean;
  k30_primary_gap: string;
  is_stable_mahalanobis: boolean;
  mahalanobis_primary_gap: string;
}

export interface District {
  id: string;
  district_name: string;
  state_name: string;
  raw_metrics: RawMetrics;
  scaled_metrics: ScaledMetrics;
  peer_means_raw: RawMetrics;
  peer_means_scaled: ScaledMetrics;
  gaps_z: ScaledMetrics;
  raw_gaps: RawMetrics;
  primary_gap: "Availability" | "Collection" | "Voluntary Donation";
  primary_gap_z: number;
  robustness: RobustnessMetrics;
  peers: PeerInfo[];
}

export interface NationalMetricStat {
  mean: number;
  std: number;
  median: number;
  min: number;
  max: number;
}

export interface StateBreakdown {
  state_name: string;
  district_count: number;
  gap_counts: {
    Availability: number;
    Collection: number;
    "Voluntary Donation": number;
  };
  averages: RawMetrics;
}

export interface ValidationStats {
  k_sensitivity: {
    k10_vs_k20: number;
    k30_vs_k20: number;
    selected_k: number;
  };
  distance_sensitivity: {
    euclidean_vs_mahalanobis: number;
    primary_metric: string;
  };
  resampling_stability: {
    mean_stability: number;
    min_stability: number;
    max_stability: number;
    iterations: number;
  };
}

export interface TopShortfallItem {
  id: string;
  district_name: string;
  state_name: string;
  gap_z: number;
  raw_val: number;
  peer_mean: number;
}

export interface SummaryStats {
  total_districts: number;
  total_states: number;
  gap_counts: {
    Availability: number;
    Collection: number;
    "Voluntary Donation": number;
  };
  national_stats: {
    availability: NationalMetricStat;
    collection: NationalMetricStat;
    voluntary: NationalMetricStat;
  };
  state_breakdown: StateBreakdown[];
  validation_stats: ValidationStats;
  top_shortfalls: {
    availability: TopShortfallItem[];
    collection: TopShortfallItem[];
    voluntary: TopShortfallItem[];
  };
  features: string[];
  dataset_year: number;
  data_source: string;
}
