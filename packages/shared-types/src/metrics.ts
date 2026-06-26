// ─── Metrics / Dashboard Types ───────────────────────────────────────────────

export type AggregationType = 'sum' | 'avg' | 'min' | 'max' | 'count' | 'p50' | 'p95' | 'p99';

export interface MetricPoint {
  /** ISO-8601 timestamp */
  timestamp: string;
  /** Numeric value at this point */
  value: number;
  /** Optional dimension tags */
  labels?: Record<string, string>;
}

export interface MetricSeries {
  /** Unique metric name (e.g. "agent.tokens.used") */
  name: string;
  /** Human-readable description */
  description?: string;
  /** Unit of measurement (e.g. "ms", "bytes", "count") */
  unit?: string;
  /** Ordered data points */
  points: MetricPoint[];
  /** Aggregation applied to produce this series */
  aggregation?: AggregationType;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export type PanelType = 'timeseries' | 'stat' | 'table' | 'gauge' | 'bar' | 'heatmap';

export interface DashboardPanel {
  id: string;
  title: string;
  type: PanelType;
  /** Which metric series to render */
  metricNames: string[];
  /** Grid position & size */
  layout: { x: number; y: number; w: number; h: number };
  /** Optional panel-level query */
  query?: string;
  thresholds?: { value: number; color: string }[];
}

export interface Dashboard {
  id: string;
  title: string;
  panels: DashboardPanel[];
  refreshIntervalMs?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Alerting ────────────────────────────────────────────────────────────────

export type AlertCondition = 'above' | 'below' | 'equal' | 'not_equal';
export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface AlertRule {
  id: string;
  name: string;
  metricName: string;
  condition: AlertCondition;
  threshold: number;
  severity: AlertSeverity;
  /** How many consecutive breaches before firing (default: 1) */
  evaluationPeriods?: number;
  /** Notification channel IDs */
  notifyChannels: string[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}
