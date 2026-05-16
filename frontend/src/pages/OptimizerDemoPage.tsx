import { useState } from 'react';
import SqlPanel from '../components/SqlPanel';
import ExplanationBox from '../components/ExplanationBox';

const REGIONS = ['Hanoi', 'HCM', 'Da Nang', 'Can Tho'];

interface RunResult {
  region: string;
  totalRevenue: number;
  rowCount: number;
  executionTimeMs: number;
}

interface ExplainResult {
  planSummary: string;
  executionTimeMs: number | null;
  planJson: unknown;
}

const fmtMs = (ms: number | null) => (ms != null ? `${ms} ms` : '—');

const EXPLAIN_BULLETS = [
  'Seq Scan — scans every row in the table (slow for large tables).',
  'Index Scan — uses the index to jump directly to matching rows (fast).',
  'Bitmap Index Scan — batch index lookups, then heap fetch (balanced).',
  'Execution Time shown by EXPLAIN ANALYZE is the actual runtime.',
];

export default function OptimizerDemoPage() {
  const [region, setRegion] = useState('Hanoi');
  const [indexStatus, setIndexStatus] = useState<boolean | null>(null);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [explainResult, setExplainResult] = useState<ExplainResult | null>(null);
  const [sql, setSql] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastAction, setLastAction] = useState('');

  const call = async (url: string, method = 'GET') => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(url, { method });
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? 'Request failed');
      if (json.sql) setSql(json.sql);
      return json;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    const json = await call('/api/demo/optimizer/status');
    if (json) setIndexStatus(json.data.indexExists);
  };

  const dropIndex = async () => {
    setLastAction('drop');
    const json = await call('/api/demo/optimizer/drop-index', 'POST');
    if (json) { setIndexStatus(false); setRunResult(null); setExplainResult(null); }
  };

  const createIndex = async () => {
    setLastAction('create');
    const json = await call('/api/demo/optimizer/create-index', 'POST');
    if (json) { setIndexStatus(true); setRunResult(null); setExplainResult(null); }
  };

  const runQueryFn = async () => {
    setLastAction('run');
    setExplainResult(null);
    const json = await call(`/api/demo/optimizer/run?region=${encodeURIComponent(region)}`);
    if (json) setRunResult(json.data);
  };

  const showExplain = async () => {
    setLastAction('explain');
    setRunResult(null);
    const json = await call(`/api/demo/optimizer/explain?region=${encodeURIComponent(region)}`);
    if (json) setExplainResult(json.data);
  };

  const isSeqScan = explainResult?.planSummary?.includes('Seq Scan');
  const isIndexScan =
    explainResult?.planSummary?.includes('Index Scan') ||
    explainResult?.planSummary?.includes('Bitmap');

  return (
    <div className="demo-page">
      <h1 className="demo-title">Query Optimizer Demo</h1>

      <div className="scenario-box">
        <strong>Scenario:</strong> The <code>sales</code> table contains ~100,000 rows.
        Compare query performance <em>before</em> and <em>after</em> creating a composite index
        on <code>(region, sale_date)</code>.
      </div>

      <div className="optimizer-dataset-note">
        Dataset: <strong>sales</strong> table — ~100,000 records
      </div>

      {/* Controls */}
      <div className="optimizer-controls">
        <div className="filter-field">
          <label>Region</label>
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="optimizer-actions">
          <button className="btn btn-secondary" onClick={checkStatus} disabled={loading}>
            Check Index Status
          </button>
          <button className="btn btn-danger" onClick={dropIndex} disabled={loading}>
            Drop Index
          </button>
          <button className="btn btn-primary" onClick={runQueryFn} disabled={loading}>
            Run Query
          </button>
          <button className="btn btn-success" onClick={createIndex} disabled={loading}>
            Create Index
          </button>
          <button className="btn btn-warning" onClick={showExplain} disabled={loading}>
            Show EXPLAIN ANALYZE
          </button>
        </div>

        {loading && <p className="loading-text">Running...</p>}
        {error && <div className="error-box">{error}</div>}
      </div>

      {/* Index status badge */}
      {indexStatus !== null && (
        <div className={`index-status-badge ${indexStatus ? 'index-on' : 'index-off'}`}>
          {indexStatus
            ? 'Index idx_sales_region_date: ACTIVE'
            : 'Index idx_sales_region_date: NOT EXISTS'}
        </div>
      )}

      {/* Run Query result */}
      {runResult && lastAction === 'run' && (
        <div className="optimizer-result-card">
          <h3>Query Result</h3>
          <table className="data-table">
            <thead>
              <tr><th>Metric</th><th>Value</th></tr>
            </thead>
            <tbody>
              <tr><td>Region</td><td>{runResult.region}</td></tr>
              <tr>
                <td>Total Revenue (last 30 days)</td>
                <td className="mono">{runResult.totalRevenue.toLocaleString('vi-VN')} VND</td>
              </tr>
              <tr><td>Row Count Returned</td><td>{runResult.rowCount}</td></tr>
              <tr>
                <td>Execution Time</td>
                <td className={`mono ${runResult.executionTimeMs > 100 ? 'slow-time' : 'fast-time'}`}>
                  {fmtMs(runResult.executionTimeMs)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* EXPLAIN ANALYZE result */}
      {explainResult && lastAction === 'explain' && (
        <div className="optimizer-result-card">
          <h3>EXPLAIN ANALYZE</h3>
          <div className="explain-summary">
            <span className={`plan-badge ${isSeqScan ? 'seq-scan' : isIndexScan ? 'index-scan' : ''}`}>
              {explainResult.planSummary}
            </span>
            <span className="explain-time">
              Execution Time: <strong>{fmtMs(explainResult.executionTimeMs)}</strong>
            </span>
          </div>

          <details className="explain-details">
            <summary>View full EXPLAIN JSON</summary>
            <pre className="explain-json">
              {JSON.stringify(explainResult.planJson, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {sql && <SqlPanel sql={sql} />}

      <ExplanationBox
        feature="Query Optimizer & EXPLAIN ANALYZE"
        explanation="PostgreSQL's query planner chooses the most efficient execution strategy based on available indexes and table statistics. EXPLAIN ANALYZE reveals the actual plan used."
        bullets={EXPLAIN_BULLETS}
      />
    </div>
  );
}
