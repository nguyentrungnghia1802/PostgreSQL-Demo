import { useState } from 'react';
import SqlPanel from '../components/SqlPanel';
import ExplanationBox from '../components/ExplanationBox';

/* ─────────────── Types ─────────────── */
type AuditLog = {
  id: string;
  table_name: string;
  action: string;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  created_at: string;
};
type RevenueRow = { region: string; total_revenue: string; total_sales: string };
type Product    = Record<string, unknown>;

/* ─────────────── Component ─────────────── */
export default function EnterpriseDemoPage() {
  /* ── 1. Constraint state ── */
  const [constraintLoading, setConstraintLoading] = useState(false);
  const [constraintResult, setConstraintResult] = useState<{
    constraintWorked: boolean;
    databaseError: string | null;
    sql: string;
    explanation: string;
  } | null>(null);

  /* ── 2. Audit state ── */
  const [productName, setProductName] = useState('iPhone 15 Pro');
  const [increaseAmount, setIncreaseAmount] = useState('1000000');
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<{
    updatedProduct: Product | null;
    latestAuditLog: AuditLog | null;
    sql: string;
    explanation: string;
  } | null>(null);
  const [logsLoading, setLogsLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[] | null>(null);
  const [logsSql, setLogsSql] = useState('');

  /* ── 3. View state ── */
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);
  const [viewResult, setViewResult] = useState<{
    rows: RevenueRow[];
    sql: string;
    explanation: string;
  } | null>(null);

  /* ── Handlers ── */
  const handleConstraint = async () => {
    setConstraintLoading(true);
    setConstraintResult(null);
    try {
      const res  = await fetch('/api/demo/enterprise/constraint/invalid-product', { method: 'POST' });
      const json = await res.json();
      setConstraintResult({
        constraintWorked: json.data.constraintWorked,
        databaseError: json.data.databaseError,
        sql: json.sql,
        explanation: json.explanation,
      });
    } finally {
      setConstraintLoading(false);
    }
  };

  const handleAuditUpdate = async () => {
    setAuditLoading(true);
    setAuditError(null);
    setAuditResult(null);
    try {
      const res  = await fetch('/api/demo/enterprise/audit/update-product-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, increaseAmount: Number(increaseAmount) }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? 'Error');
      setAuditResult({
        updatedProduct: json.data.updatedProduct,
        latestAuditLog: json.data.latestAuditLog,
        sql: json.sql,
        explanation: json.explanation,
      });
    } catch (err) {
      setAuditError((err as Error).message);
    } finally {
      setAuditLoading(false);
    }
  };

  const handleLoadLogs = async () => {
    setLogsLoading(true);
    try {
      const res  = await fetch('/api/demo/enterprise/audit/logs');
      const json = await res.json();
      setAuditLogs(json.data.logs);
      setLogsSql(json.sql);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleLoadRevenue = async () => {
    setViewLoading(true);
    setViewError(null);
    setViewResult(null);
    try {
      const res  = await fetch('/api/demo/enterprise/views/revenue-by-region');
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? 'Error');
      setViewResult({ rows: json.data.rows, sql: json.sql, explanation: json.explanation });
    } catch (err) {
      setViewError((err as Error).message);
    } finally {
      setViewLoading(false);
    }
  };

  /* ── Helpers ── */
  const fmt = (n: unknown) => Number(n).toLocaleString('vi-VN');

  return (
    <div className="demo-page">
      <h2>Enterprise Database Features</h2>
      <p className="ent-subtitle">
        Demonstrating how PostgreSQL protects data integrity at the database level —
        no application code required.
      </p>

      {/* ═══════════════ 1. Constraint ═══════════════ */}
      <section className="ent-section">
        <div className="ent-section-header">
          <span className="ent-badge red-badge">CHECK Constraint</span>
          <h3>Schema-Level Data Validation</h3>
        </div>
        <p className="ent-desc">
          Attempt to insert a product with price = -1000. PostgreSQL will reject it immediately.
        </p>
        <button className="btn btn-danger" onClick={handleConstraint} disabled={constraintLoading}>
          {constraintLoading ? 'Running…' : 'Try Insert Invalid Product'}
        </button>

        {constraintResult && (
          <>
            <div className={`constraint-result ${constraintResult.constraintWorked ? 'constraint-ok' : 'constraint-fail'}`}>
              {constraintResult.constraintWorked ? (
                <>
                  <span className="constraint-icon">✓</span>
                  <div>
                    <strong>Database rejected the invalid data!</strong>
                    <p className="constraint-error-msg">{constraintResult.databaseError}</p>
                  </div>
                </>
              ) : (
                <>
                  <span className="constraint-icon">✗</span>
                  <strong>INSERT succeeded — constraint may not be active.</strong>
                </>
              )}
            </div>
            <SqlPanel sql={constraintResult.sql} />
            <ExplanationBox
              feature="CHECK Constraint"
              explanation={constraintResult.explanation}
              bullets={[
                'price NUMERIC(12,2) NOT NULL CHECK (price > 0) defined in schema',
                'PostgreSQL enforces the check on every INSERT and UPDATE',
                'Application code cannot accidentally bypass it',
                'Reduces defensive code duplication across services',
              ]}
            />
          </>
        )}
      </section>

      {/* ═══════════════ 2. Trigger + Audit Log ═══════════════ */}
      <section className="ent-section">
        <div className="ent-section-header">
          <span className="ent-badge blue-badge">Trigger + Audit Log</span>
          <h3>Automatic Change Tracking</h3>
        </div>
        <p className="ent-desc">
          Update a product price. PostgreSQL fires a trigger automatically and logs the change.
        </p>

        <div className="ent-controls">
          <label>
            Product Name
            <input
              className="ent-input"
              value={productName}
              onChange={e => setProductName(e.target.value)}
            />
          </label>
          <label>
            Increase Amount (VND)
            <input
              type="number"
              className="ent-input"
              value={increaseAmount}
              onChange={e => setIncreaseAmount(e.target.value)}
            />
          </label>
          <button className="btn btn-primary" onClick={handleAuditUpdate} disabled={auditLoading}>
            {auditLoading ? 'Updating…' : 'Update Product Price'}
          </button>
          <button className="btn btn-secondary" onClick={handleLoadLogs} disabled={logsLoading}>
            {logsLoading ? 'Loading…' : 'Load Audit Logs'}
          </button>
        </div>

        {auditError && <div className="error-box">{auditError}</div>}

        {auditResult && (
          <>
            {auditResult.updatedProduct && (
              <div className="ent-result-card">
                <h4>Updated Product</h4>
                <table>
                  <thead><tr><th>Name</th><th>Category</th><th>New Price (VND)</th></tr></thead>
                  <tbody>
                    <tr>
                      <td>{String(auditResult.updatedProduct.name)}</td>
                      <td>{String(auditResult.updatedProduct.category)}</td>
                      <td className="mono">{fmt(auditResult.updatedProduct.price)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {auditResult.latestAuditLog && (
              <div className="ent-result-card">
                <h4>Latest Audit Log Entry</h4>
                <div className="audit-log-row">
                  <div className="audit-col">
                    <span className="audit-label">old_data (before)</span>
                    <pre className="audit-json">{JSON.stringify(auditResult.latestAuditLog.old_data, null, 2)}</pre>
                  </div>
                  <div className="audit-col">
                    <span className="audit-label">new_data (after)</span>
                    <pre className="audit-json">{JSON.stringify(auditResult.latestAuditLog.new_data, null, 2)}</pre>
                  </div>
                </div>
                <p className="audit-meta">
                  Table: <strong>{auditResult.latestAuditLog.table_name}</strong> &nbsp;|&nbsp;
                  Action: <strong>{auditResult.latestAuditLog.action}</strong> &nbsp;|&nbsp;
                  At: <strong>{new Date(auditResult.latestAuditLog.created_at).toLocaleString()}</strong>
                </p>
              </div>
            )}
            <SqlPanel sql={auditResult.sql} />
            <ExplanationBox
              feature="Trigger + Audit Log"
              explanation={auditResult.explanation}
              bullets={[
                'CREATE TRIGGER fires AFTER UPDATE on products FOR EACH ROW',
                'log_product_changes() stores row_to_json(OLD) and row_to_json(NEW) as JSONB',
                'Zero application code needed — every update is automatically tracked',
                'audit_logs stores full row snapshots for point-in-time recovery',
              ]}
            />
          </>
        )}

        {auditLogs && (
          <div className="ent-result-card" style={{ marginTop: '1rem' }}>
            <h4>Recent Audit Logs ({auditLogs.length})</h4>
            {auditLogs.length === 0 ? (
              <p style={{ color: '#718096' }}>No audit logs yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Table</th>
                    <th>Action</th>
                    <th>Old Price</th>
                    <th>New Price</th>
                    <th>At</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map(log => (
                    <tr key={log.id}>
                      <td>{log.table_name}</td>
                      <td><span className="action-badge">{log.action}</span></td>
                      <td className="mono">{log.old_data ? fmt((log.old_data as Record<string,unknown>).price) : '—'}</td>
                      <td className="mono">{log.new_data ? fmt((log.new_data as Record<string,unknown>).price) : '—'}</td>
                      <td>{new Date(log.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {logsSql && <SqlPanel sql={logsSql} />}
          </div>
        )}
      </section>

      {/* ═══════════════ 3. View ═══════════════ */}
      <section className="ent-section">
        <div className="ent-section-header">
          <span className="ent-badge green-badge">View</span>
          <h3>Revenue by Region</h3>
        </div>
        <p className="ent-desc">
          Query the <code>revenue_by_region</code> VIEW — a pre-defined analytical query stored in the database.
        </p>
        <button className="btn btn-primary" onClick={handleLoadRevenue} disabled={viewLoading}>
          {viewLoading ? 'Loading…' : 'Load Revenue By Region'}
        </button>

        {viewError && <div className="error-box">{viewError}</div>}

        {viewResult && (
          <>
            <div className="ent-result-card">
              <h4>Revenue by Region</h4>
              <table>
                <thead>
                  <tr>
                    <th>Region</th>
                    <th>Total Revenue (VND)</th>
                    <th>Total Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {viewResult.rows.map((row, i) => (
                    <tr key={i}>
                      <td>{row.region}</td>
                      <td className="mono">{fmt(row.total_revenue)}</td>
                      <td className="mono">{Number(row.total_sales).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <SqlPanel sql={viewResult.sql} />
            <ExplanationBox
              feature="PostgreSQL VIEW"
              explanation={viewResult.explanation}
              bullets={[
                'CREATE VIEW encapsulates a complex SELECT as a reusable object',
                'Query it like a table: SELECT * FROM revenue_by_region',
                'Changes to underlying data are reflected instantly',
                'Can be granted SELECT permission independently from base tables',
                'Materialized views add caching for expensive aggregations',
              ]}
            />
          </>
        )}
      </section>
    </div>
  );
}
