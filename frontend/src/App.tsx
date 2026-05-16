import { useState } from 'react';
import { checkBackendHealth, checkDatabaseHealth } from './services/api';

type HealthResult = {
  status: string;
  service: string;
  message?: string;
  result?: number;
};

function App() {
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
    <div className="app-container">
      <header className="app-header">
        <h1>PostgreSQL Feature Showcase</h1>
        <p>A demo tool showcasing the strengths of PostgreSQL as a modern, enterprise-grade DBMS</p>
      </header>

      <main className="app-main">
        <section className="home-section">
          <h2>System Health Check</h2>
          <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Verify that backend and database connections are working correctly.
          </p>

          <div className="health-grid">
            {/* Backend Health */}
            <div className="health-card">
              <h3>Backend (Node.js / Express)</h3>
              <button
                className="btn btn-primary"
                onClick={handleBackendHealth}
                disabled={backendLoading}
              >
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
              {backendError && (
                <div className="result-box error">
                  ERROR: {backendError}
                </div>
              )}
            </div>

            {/* Database Health */}
            <div className="health-card">
              <h3>Database (PostgreSQL)</h3>
              <button
                className="btn btn-primary"
                onClick={handleDatabaseHealth}
                disabled={dbLoading}
              >
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
              {dbError && (
                <div className="result-box error">
                  ERROR: {dbError}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="home-section">
          <h2>Available Demo Modules</h2>
          <p style={{ color: '#718096', fontSize: '0.9rem' }}>
            More demo modules will be added in subsequent steps:
          </p>
          <ul style={{ marginTop: '0.75rem', paddingLeft: '1.5rem', color: '#4a5568', lineHeight: '2' }}>
            <li><strong>JSONB &amp; Flexible Data</strong> — Store &amp; query flexible product attributes</li>
            <li><strong>ACID Transaction</strong> — Commit and rollback demonstration</li>
            <li><strong>Query Optimizer</strong> — EXPLAIN ANALYZE and index performance</li>
            <li><strong>PostGIS</strong> — Geographic queries and nearest-store search</li>
            <li><strong>pgvector</strong> — AI vector similarity search</li>
            <li><strong>Enterprise Features</strong> — Constraints, triggers, audit logs, views</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
