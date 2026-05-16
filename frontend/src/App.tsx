import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { checkBackendHealth, checkDatabaseHealth } from './services/api';
import JsonbDemoPage from './pages/JsonbDemoPage';
import TransactionDemoPage from './pages/TransactionDemoPage';

type HealthResult = {
  status: string;
  service: string;
  message?: string;
  result?: number;
};

function HomePage() {
  const [backendResult, setBackendResult] = useState<HealthResult | null>(null);
  const [dbResult, setDbResult] = useState<HealthResult | null>(null);
  const [backendLoading, setBackendLoading] = useState(false);
  const [dbLoading, setDbLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);

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
      <section className="home-section">
        <h2>System Health Check</h2>
        <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Verify that backend and database connections are working correctly.
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

      <section className="home-section">
        <h2>Available Demo Modules</h2>
        <div className="feature-grid">
          {[
            { label: 'JSONB & Flexible Data', path: '/demo/jsonb', done: true },
            { label: 'ACID Transaction', path: '/demo/transaction', done: true },
            { label: 'Query Optimizer', path: '/demo/optimizer', done: false },
            { label: 'PostGIS Spatial', path: '/demo/postgis', done: false },
            { label: 'pgvector Semantic Search', path: '/demo/pgvector', done: false },
            { label: 'Trigger & Audit Log', path: '/demo/trigger', done: false },
          ].map(({ label, path, done }) => (
            <NavLink
              key={path}
              to={path}
              className={`feature-card ${done ? 'feature-ready' : 'feature-coming'}`}
            >
              <span>{label}</span>
              <span className="feature-status">{done ? '→' : 'Coming soon'}</span>
            </NavLink>
          ))}
        </div>
      </section>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <h1>PostgreSQL Feature Showcase</h1>
          <p>A demo tool showcasing the strengths of PostgreSQL as a modern, enterprise-grade DBMS</p>
          <nav className="app-nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
            <NavLink to="/demo/jsonb" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>JSONB</NavLink>
            <NavLink to="/demo/transaction" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Transaction</NavLink>
            <NavLink to="/demo/optimizer" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Optimizer</NavLink>
            <NavLink to="/demo/postgis" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>PostGIS</NavLink>
            <NavLink to="/demo/pgvector" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>pgvector</NavLink>
            <NavLink to="/demo/trigger" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Trigger</NavLink>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/demo/jsonb" element={<JsonbDemoPage />} />
          <Route path="/demo/transaction" element={<TransactionDemoPage />} />
          <Route path="/demo/optimizer" element={<div className="demo-page"><h2>Query Optimizer Demo</h2><p>Coming soon...</p></div>} />
          <Route path="/demo/postgis" element={<div className="demo-page"><h2>PostGIS Demo</h2><p>Coming soon...</p></div>} />
          <Route path="/demo/pgvector" element={<div className="demo-page"><h2>pgvector Demo</h2><p>Coming soon...</p></div>} />
          <Route path="/demo/trigger" element={<div className="demo-page"><h2>Trigger & Audit Log Demo</h2><p>Coming soon...</p></div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
