import { useState } from 'react';
import SqlPanel from '../components/SqlPanel';
import ExplanationBox from '../components/ExplanationBox';

interface AccountState {
  aliceBalance: number | null;
  bobBalance: number | null;
  transferLogCount: number;
  logs?: Array<{ id: string; amount: string; status: string; note: string; created_at: string }>;
}

interface TransactionResult {
  beforeState: AccountState;
  afterState: AccountState;
  transactionStatus: 'COMMITTED' | 'ROLLED_BACK';
}

const fmt = (n: number | null) =>
  n != null ? n.toLocaleString('vi-VN') + ' VND' : '—';

const ACID_BULLETS = [
  'Atomicity — All steps succeed together or all are rolled back.',
  'Consistency — Balance constraints are always maintained.',
  'Isolation — FOR UPDATE prevents concurrent modifications.',
  'Durability — COMMIT writes changes permanently to disk.',
];

export default function TransactionDemoPage() {
  const [currentState, setCurrentState] = useState<AccountState | null>(null);
  const [result, setResult] = useState<TransactionResult | null>(null);
  const [sql, setSql] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchState = async () => {
    const res = await fetch('/api/demo/transaction/state');
    const json = await res.json();
    setCurrentState(json.data);
  };

  const call = async (url: string, method = 'POST') => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' } });
      const json = await res.json();
      if (json.sql) setSql(json.sql);
      if (json.data?.beforeState) {
        setResult({
          beforeState: json.data.beforeState,
          afterState: json.data.afterState,
          transactionStatus: json.data.transactionStatus,
        });
        setCurrentState(json.data.afterState);
      } else if (json.data) {
        setCurrentState(json.data);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="demo-page">
      <h1 className="demo-title">ACID Transaction Demo</h1>

      <div className="scenario-box">
        <strong>Scenario:</strong> Alice transfers 3,000,000 VND to Bob.
        If an error occurs in the middle, PostgreSQL rolls back <em>all</em> changes — balance stays intact.
      </div>

      {/* Current State */}
      <div className="tx-state-card">
        <h2>Current State</h2>
        {currentState ? (
          <table className="data-table">
            <thead>
              <tr><th>Account</th><th>Balance</th><th>Transfer Log Count</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Alice</td>
                <td className="balance-cell">{fmt(currentState.aliceBalance)}</td>
                <td rowSpan={2} className="center">{currentState.transferLogCount}</td>
              </tr>
              <tr>
                <td>Bob</td>
                <td className="balance-cell">{fmt(currentState.bobBalance)}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="empty-result">Click "Load State" to see current balances.</p>
        )}

        <div className="tx-buttons">
          <button className="btn btn-secondary" onClick={fetchState} disabled={loading}>
            Load State
          </button>
          <button className="btn btn-warning" onClick={() => call('/api/demo/transaction/reset')} disabled={loading}>
            Reset Demo Data
          </button>
          <button className="btn btn-success" onClick={() => call('/api/demo/transaction/success')} disabled={loading}>
            Run Successful Transfer
          </button>
          <button className="btn btn-danger" onClick={() => call('/api/demo/transaction/failure')} disabled={loading}>
            Run Failed Transfer
          </button>
        </div>

        {loading && <p className="loading-text">Running transaction...</p>}
        {error && <div className="error-box">{error}</div>}
      </div>

      {/* Before / After table */}
      {result && (
        <div className="tx-result-section">
          <div className={`tx-status-badge ${result.transactionStatus === 'COMMITTED' ? 'committed' : 'rolledback'}`}>
            {result.transactionStatus}
          </div>

          <table className="data-table tx-before-after">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Before</th>
                <th>After</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Alice Balance</td>
                <td>{fmt(result.beforeState.aliceBalance)}</td>
                <td>{fmt(result.afterState.aliceBalance)}</td>
                <td className={
                  (result.afterState.aliceBalance ?? 0) < (result.beforeState.aliceBalance ?? 0)
                    ? 'change-negative' : 'change-neutral'
                }>
                  {result.afterState.aliceBalance != null && result.beforeState.aliceBalance != null
                    ? ((result.afterState.aliceBalance - result.beforeState.aliceBalance) >= 0 ? '+' : '') +
                      (result.afterState.aliceBalance - result.beforeState.aliceBalance).toLocaleString('vi-VN') + ' VND'
                    : '—'}
                </td>
              </tr>
              <tr>
                <td>Bob Balance</td>
                <td>{fmt(result.beforeState.bobBalance)}</td>
                <td>{fmt(result.afterState.bobBalance)}</td>
                <td className={
                  (result.afterState.bobBalance ?? 0) > (result.beforeState.bobBalance ?? 0)
                    ? 'change-positive' : 'change-neutral'
                }>
                  {result.afterState.bobBalance != null && result.beforeState.bobBalance != null
                    ? ((result.afterState.bobBalance - result.beforeState.bobBalance) >= 0 ? '+' : '') +
                      (result.afterState.bobBalance - result.beforeState.bobBalance).toLocaleString('vi-VN') + ' VND'
                    : '—'}
                </td>
              </tr>
              <tr>
                <td>Transfer Logs</td>
                <td>{result.beforeState.transferLogCount}</td>
                <td>{result.afterState.transferLogCount}</td>
                <td className={
                  result.afterState.transferLogCount > result.beforeState.transferLogCount
                    ? 'change-positive' : 'change-neutral'
                }>
                  {result.afterState.transferLogCount - result.beforeState.transferLogCount >= 0 ? '+' : ''}
                  {result.afterState.transferLogCount - result.beforeState.transferLogCount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {sql && <SqlPanel sql={sql} />}

      <ExplanationBox
        feature="ACID Transaction"
        explanation="PostgreSQL guarantees all-or-nothing execution of a transaction. If any step fails, every change in that transaction is automatically rolled back."
        bullets={ACID_BULLETS}
      />
    </div>
  );
}
