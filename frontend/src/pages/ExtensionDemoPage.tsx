import { useState } from 'react';
import SqlPanel from '../components/SqlPanel';
import ExplanationBox from '../components/ExplanationBox';

/* ─────────────── Types ─────────────── */
type Store = { name: string; address: string; distance_km: string };
type Product = {
  name: string;
  category: string;
  price: string | number;
  description: string;
  distance: string | number;
};

const QUERY_TYPES = [
  { value: 'travel_camera',     label: 'Travel + Camera Product' },
  { value: 'work_laptop',       label: 'Work Laptop Product' },
  { value: 'sport_lightweight', label: 'Sport Lightweight Product' },
];

/* ─────────────── Component ─────────────── */
export default function ExtensionDemoPage() {
  /* PostGIS state */
  const [lat, setLat] = useState('21.0285');
  const [lng, setLng] = useState('105.8542');
  const [limit, setLimit] = useState('5');
  const [gisLoading, setGisLoading] = useState(false);
  const [gisError, setGisError] = useState<string | null>(null);
  const [gisResult, setGisResult] = useState<{ stores: Store[]; sql: string; explanation: string } | null>(null);

  /* pgvector state */
  const [queryType, setQueryType] = useState('travel_camera');
  const [vecLoading, setVecLoading] = useState(false);
  const [vecError, setVecError] = useState<string | null>(null);
  const [vecResult, setVecResult] = useState<{
    results: Product[];
    vector: number[];
    queryType: string;
    sql: string;
    explanation: string;
  } | null>(null);

  /* ── PostGIS handler ── */
  const handleFindStores = async () => {
    setGisLoading(true);
    setGisError(null);
    setGisResult(null);
    try {
      const res = await fetch(
        `/api/demo/extensions/postgis/nearest?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&limit=${encodeURIComponent(limit)}`
      );
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? 'Unknown error');
      setGisResult({
        stores: json.data.stores,
        sql: json.sql,
        explanation: json.explanation,
      });
    } catch (err) {
      setGisError((err as Error).message);
    } finally {
      setGisLoading(false);
    }
  };

  /* ── pgvector handler ── */
  const handleVectorSearch = async () => {
    setVecLoading(true);
    setVecError(null);
    setVecResult(null);
    try {
      const res = await fetch('/api/demo/extensions/pgvector/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryType }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? 'Unknown error');
      setVecResult({
        results: json.data.results,
        vector: json.data.vector,
        queryType: json.data.queryType,
        sql: json.sql,
        explanation: json.explanation,
      });
    } catch (err) {
      setVecError((err as Error).message);
    } finally {
      setVecLoading(false);
    }
  };

  return (
    <div className="demo-page">
      <h2>PostgreSQL Extension Demo</h2>
      <p className="ext-subtitle">
        Showcasing <strong>PostGIS</strong> (geographic queries) and <strong>pgvector</strong> (AI semantic search) —
        two extensions that turn PostgreSQL into a spatial + AI database.
      </p>

      {/* ═══════════════ PostGIS Section ═══════════════ */}
      <section className="ext-section">
        <div className="ext-section-header postgis-header">
          <span className="ext-badge">PostGIS</span>
          <h3>Nearest Store Finder</h3>
        </div>
        <p className="ext-desc">
          Enter a coordinate and PostgreSQL will find the closest stores using real geographic distance (in km).
        </p>

        <div className="ext-controls">
          <label>
            Latitude
            <input
              type="number"
              className="ext-input"
              value={lat}
              onChange={e => setLat(e.target.value)}
              step="0.0001"
            />
          </label>
          <label>
            Longitude
            <input
              type="number"
              className="ext-input"
              value={lng}
              onChange={e => setLng(e.target.value)}
              step="0.0001"
            />
          </label>
          <label>
            Limit
            <input
              type="number"
              className="ext-input ext-input-sm"
              value={limit}
              onChange={e => setLimit(e.target.value)}
              min="1"
              max="20"
            />
          </label>
          <button className="btn btn-primary" onClick={handleFindStores} disabled={gisLoading}>
            {gisLoading ? 'Searching…' : 'Find Nearest Stores'}
          </button>
        </div>

        {gisError && <div className="error-box">{gisError}</div>}

        {gisResult && (
          <>
            <div className="ext-result-card">
              <h4>Results — {gisResult.stores.length} stores found</h4>
              {gisResult.stores.length === 0 ? (
                <p style={{ color: '#718096' }}>No stores found.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Store Name</th>
                      <th>Address</th>
                      <th>Distance (km)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gisResult.stores.map((s, i) => (
                      <tr key={i}>
                        <td>{s.name}</td>
                        <td>{s.address}</td>
                        <td className="mono">{s.distance_km}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <SqlPanel sql={gisResult.sql} />
            <ExplanationBox
              feature="PostGIS — Spatial Data Extension"
              explanation={gisResult.explanation}
              bullets={[
                'GEOGRAPHY type stores real-world coordinates with WGS84 datum',
                'ST_MakePoint(lng, lat) — longitude comes first in PostGIS convention',
                '<-> operator triggers GiST index for O(log n) nearest-neighbor search',
                'ST_Distance computes exact great-circle distance in meters',
                'Handles millions of GPS points with sub-millisecond query times',
              ]}
            />
          </>
        )}
      </section>

      {/* ═══════════════ pgvector Section ═══════════════ */}
      <section className="ext-section">
        <div className="ext-section-header pgvector-header">
          <span className="ext-badge pgvector-badge">pgvector</span>
          <h3>AI Semantic Search</h3>
        </div>
        <p className="ext-desc">
          Select a product profile and PostgreSQL will find the most semantically similar products using vector distance.
        </p>

        <div className="ext-controls">
          <label>
            Query Type
            <select
              className="ext-select"
              value={queryType}
              onChange={e => setQueryType(e.target.value)}
            >
              {QUERY_TYPES.map(qt => (
                <option key={qt.value} value={qt.value}>{qt.label}</option>
              ))}
            </select>
          </label>
          <button className="btn btn-primary" onClick={handleVectorSearch} disabled={vecLoading}>
            {vecLoading ? 'Searching…' : 'Search by Vector Similarity'}
          </button>
        </div>

        {vecResult && (
          <div className="vector-badge-row">
            <span className="vector-label">Query vector:</span>
            <span className="vector-value mono">[{vecResult.vector.join(', ')}]</span>
          </div>
        )}

        {vecError && <div className="error-box">{vecError}</div>}

        {vecResult && (
          <>
            <div className="ext-result-card">
              <h4>Top {vecResult.results.length} Similar Products</h4>
              {vecResult.results.length === 0 ? (
                <p style={{ color: '#718096' }}>No results.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price (VND)</th>
                      <th>Description</th>
                      <th>Distance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vecResult.results.map((p, i) => (
                      <tr key={i}>
                        <td>{p.name}</td>
                        <td>{p.category}</td>
                        <td className="mono">{Number(p.price).toLocaleString()}</td>
                        <td>{p.description}</td>
                        <td className="mono dist-cell">{Number(p.distance).toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <SqlPanel sql={vecResult.sql} />
            <ExplanationBox
              feature="pgvector — Vector Similarity Extension"
              explanation={vecResult.explanation}
              bullets={[
                'VECTOR(n) type stores n-dimensional embeddings from AI models',
                '<-> operator computes L2 (Euclidean) distance between vectors',
                'Smaller distance = more similar products',
                'IVFFlat / HNSW indexes enable ANN (Approximate Nearest Neighbor) search',
                'Eliminates the need for a separate vector database (Pinecone, Weaviate…)',
              ]}
            />
          </>
        )}
      </section>
    </div>
  );
}
