const API_BASE = '/api';

export async function checkBackendHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function checkDatabaseHealth() {
  const res = await fetch(`${API_BASE}/health/db`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function resetAllDemoData() {
  const res = await fetch(`${API_BASE}/demo/reset-all`, { method: 'POST' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getDemoCounts() {
  const res = await fetch(`${API_BASE}/demo/counts`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
