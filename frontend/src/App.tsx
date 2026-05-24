import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { checkBackendHealth, checkDatabaseHealth, resetAllDemoData } from './services/api';
import JsonbDemoPage from './pages/JsonbDemoPage';
import TransactionDemoPage from './pages/TransactionDemoPage';
import OptimizerDemoPage from './pages/OptimizerDemoPage';
import ExtensionDemoPage from './pages/ExtensionDemoPage';
import EnterpriseDemoPage from './pages/EnterpriseDemoPage';

type HealthResult = {
  status: string;
  service: string;
  message?: string;
  result?: number;
};

const FEATURE_CARDS = [
  {
    label: 'Flexible Data',
    path: '/demo/jsonb',
    tags: ['JSONB', 'Array', 'UUID', 'GIN Index'],
    desc: 'Store flexible product attributes with JSONB, multi-value tags with Array, and collision-resistant IDs with UUID.',
  },
  {
    label: 'ACID Transaction',
    path: '/demo/transaction',
    tags: ['Commit', 'Rollback', 'FOR UPDATE'],
    desc: 'Watch PostgreSQL guarantee atomic transfers — rollback leaves zero partial state.',
  },
  {
    label: 'PostgreSQL Extensions',
    path: '/demo/extensions',
    tags: ['PostGIS', 'pgvector'],
    desc: 'Find nearest stores with geospatial queries and run AI semantic search — all inside PostgreSQL.',
  },
  {
    label: 'Query Optimizer',
    path: '/demo/optimizer',
    tags: ['Index', 'EXPLAIN ANALYZE'],
    desc: 'Compare Seq Scan vs Index Scan and read real execution plans with EXPLAIN ANALYZE.',
  },
  {
    label: 'Enterprise Features',
    path: '/demo/enterprise',
    tags: ['Constraint', 'Trigger', 'Audit Log', 'View'],
    desc: 'Schema-level data validation, automatic audit logging via triggers, and reusable analytical views.',
  },
] as const;

const FEATURE_MAP = [
  { feature: 'UUID',             demo: 'Flexible Data',  why: 'Safer primary keys for distributed systems' },
  { feature: 'JSONB',            demo: 'Flexible Data',  why: 'Flexible document-like attributes per product' },
  { feature: 'Array',            demo: 'Flexible Data',  why: 'Store multi-value tags in a single column' },
  { feature: 'GIN Index',        demo: 'Flexible Data',  why: 'Speed up JSONB and Array queries' },
  { feature: 'Custom Type',      demo: 'Transaction',    why: 'Strict status values enforced at schema level' },
  { feature: 'ACID Transaction', demo: 'Transaction',    why: 'Prevent partial updates across operations' },
  { feature: 'Rollback',         demo: 'Transaction',    why: 'Recover cleanly from mid-process failure' },
  { feature: 'PostGIS',          demo: 'Extensions',     why: 'Geospatial search natively inside the database' },
  { feature: 'pgvector',         demo: 'Extensions',     why: 'AI semantic search without a separate vector store' },
  { feature: 'EXPLAIN ANALYZE',  demo: 'Optimizer',      why: 'Understand how PostgreSQL executes a query' },
  { feature: 'Trigger',          demo: 'Enterprise',     why: 'Automatic audit log on every row change' },
  { feature: 'View',             demo: 'Enterprise',     why: 'Reusable analytics query stored as a named object' },
] as const;

function HomePage() {
  const [backendResult, setBackendResult] = useState<HealthResult | null>(null);
  const [dbResult, setDbResult] = useState<HealthResult | null>(null);
  const [backendLoading, setBackendLoading] = useState(false);
  const [dbLoading, setDbLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);
  const [resetStatus, setResetStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');

  const handleResetAll = async () => {
    setResetStatus('loading');
    try {
      await resetAllDemoData();
      setResetStatus('ok');
      setTimeout(() => setResetStatus('idle'), 3000);
    } catch {
      setResetStatus('error');
      setTimeout(() => setResetStatus('idle'), 3000);
    }
  };

  const handleBackendHealth = async () => {
    setBackendLoading(true);
    setBackendError(null);
    try {
      const data = await checkBackendHealth();
      setBackendResult(data);
    } catch (err) {
      setBackendError((err as Error).message);
      setBackendResult(null);
    } finally {
      setBackendLoading(false);
    }
  };

  const handleDatabaseHealth = async () => {
    setDbLoading(true);
    setDbError(null);
    try {
      const data = await checkDatabaseHealth();
      setDbResult(data);
    } catch (err) {
      setDbError((err as Error).message);
      setDbResult(null);
    } finally {
      setDbLoading(false);
    }
  };

  return (
    <main className="app-main">
      {/* ── Hero subtitle ── */}
      <div className="home-hero">
        <p>A focused demo platform for showing PostgreSQL's strongest DBMS capabilities.</p>
        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="btn btn-danger"
            onClick={handleResetAll}
            disabled={resetStatus === 'loading'}
          >
            {resetStatus === 'loading' ? 'Resetting...' : 'Reset All Demo Data'}
          </button>
          {resetStatus === 'ok' && (
            <span className="status-badge status-ok">All demo data reset successfully</span>
          )}
          {resetStatus === 'error' && (
            <span className="status-badge status-error">Reset failed — is the backend running?</span>
          )}
        </div>
      </div>

      {/* ── Demo Modules ── */}
      <section className="home-section">
        <h2>Demo Modules</h2>
        <div className="feature-grid-v2">
          {FEATURE_CARDS.map(({ label, path, tags, desc }) => (
            <NavLink key={path} to={path} className="feature-card-v2">
              <div className="fc-header">
                <span className="fc-label">{label}</span>
                <span className="fc-arrow">→</span>
              </div>
              <p className="fc-desc">{desc}</p>
              <div className="fc-tags">
                {tags.map(t => <span key={t} className="fc-tag">{t}</span>)}
              </div>
            </NavLink>
          ))}
        </div>
      </section>

      {/* ── Feature Mapping Table ── */}
      <section className="home-section">
        <h2>PostgreSQL Feature Mapping</h2>
        <table className="feature-map-table">
          <thead>
            <tr>
              <th>PostgreSQL Feature</th>
              <th>Demo Screen</th>
              <th>Why It Matters</th>
            </tr>
          </thead>
          <tbody>
            {FEATURE_MAP.map(row => (
              <tr key={row.feature}>
                <td><code>{row.feature}</code></td>
                <td>{row.demo}</td>
                <td>{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ── Health Check ── */}
      <section className="home-section">
        <h2>System Health Check</h2>
        <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Verify backend and database connectivity before running demos.
        </p>
        <div className="health-grid">
          <div className="health-card">
            <h3>Backend (Node.js / Express)</h3>
            <button className="btn btn-primary" onClick={handleBackendHealth} disabled={backendLoading}>
              {backendLoading ? 'Checking...' : 'Check Backend Health'}
            </button>
            {backendResult && (
              <div className="result-box">
                <span className={`status-badge ${backendResult.status === 'ok' ? 'status-ok' : 'status-error'}`}>
                  {backendResult.status.toUpperCase()}
                </span>
                {'\n'}service: {backendResult.service}
              </div>
            )}
            {backendError && <div className="result-box error">ERROR: {backendError}</div>}
          </div>

          <div className="health-card">
            <h3>Database (PostgreSQL)</h3>
            <button className="btn btn-primary" onClick={handleDatabaseHealth} disabled={dbLoading}>
              {dbLoading ? 'Checking...' : 'Check Database Health'}
            </button>
            {dbResult && (
              <div className="result-box">
                <span className={`status-badge ${dbResult.status === 'ok' ? 'status-ok' : 'status-error'}`}>
                  {dbResult.status.toUpperCase()}
                </span>
                {'\n'}service: {dbResult.service}
                {dbResult.result !== undefined && `\nSELECT 1 = ${dbResult.result}`}
              </div>
            )}
            {dbError && <div className="result-box error">ERROR: {dbError}</div>}
          </div>
        </div>
      </section>
    </main>
  );
}

const navClass = ({ isActive }: { isActive: boolean }) => isActive ? 'nav-link active' : 'nav-link';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <h1>PostgreSQL Feature Showcase</h1>
          <nav className="app-nav">
            <NavLink to="/" end className={navClass}>Home</NavLink>
            <NavLink to="/demo/jsonb" className={navClass}>Flexible Data</NavLink>
            <NavLink to="/demo/transaction" className={navClass}>Transaction</NavLink>
            <NavLink to="/demo/extensions" className={navClass}>Extensions</NavLink>
            <NavLink to="/demo/optimizer" className={navClass}>Optimizer</NavLink>
            <NavLink to="/demo/enterprise" className={navClass}>Enterprise</NavLink>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/demo/jsonb" element={<JsonbDemoPage />} />
          <Route path="/demo/transaction" element={<TransactionDemoPage />} />
          <Route path="/demo/optimizer" element={<OptimizerDemoPage />} />
          {/* canonical extension routes */}
          <Route path="/demo/extensions" element={<ExtensionDemoPage />} />
          <Route path="/demo/enterprise" element={<EnterpriseDemoPage />} />
          {/* legacy aliases kept for backward compat */}
          <Route path="/demo/postgis" element={<ExtensionDemoPage />} />
          <Route path="/demo/pgvector" element={<ExtensionDemoPage />} />
          <Route path="/demo/trigger" element={<EnterpriseDemoPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
