import { useState } from 'react';
import SqlPanel from '../components/SqlPanel';
import ExplanationBox from '../components/ExplanationBox';

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  tags: string[];
  attributes: Record<string, any>;
}

interface QueryResult {
  success: boolean;
  feature: string;
  sql: string;
  data: Product[];
  explanation: string;
}

const CATEGORIES = ['all', 'smartphone', 'laptop', 'shoes', 'backpack', 'camera', 'headphone'];

export default function JsonbDemoPage() {
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [tag, setTag] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runQuery = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.set('category', category);
      if (brand.trim()) params.set('brand', brand.trim());
      if (color.trim()) params.set('color', color.trim());
      if (tag.trim()) params.set('tag', tag.trim());

      const res = await fetch(`/api/demo/jsonb?${params.toString()}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setResult(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (p: string) =>
    Number(p).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  return (
    <div className="demo-page">
      <h2 className="demo-title">JSONB &amp; Flexible Data Demo</h2>

      <div className="scenario-box">
        <strong>Tình huống demo:</strong> Các loại sản phẩm khác nhau có thuộc tính khác nhau.
        PostgreSQL lưu linh hoạt bằng JSONB trong khi vẫn hỗ trợ SQL filter.
        GIN index đảm bảo tìm kiếm nhanh dù không biết trước cấu trúc.
      </div>

      <div className="filter-form">
        <h3>Filter Products</h3>
        <div className="filter-grid">
          <div className="filter-field">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c === 'all' ? '' : c}>
                  {c === 'all' ? '-- All categories --' : c}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-field">
            <label>Brand (JSONB)</label>
            <input
              type="text"
              placeholder="e.g. Apple, Samsung, Nike"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
          <div className="filter-field">
            <label>Color (JSONB)</label>
            <input
              type="text"
              placeholder="e.g. Black, White, Silver"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div className="filter-field">
            <label>Tag (Array)</label>
            <input
              type="text"
              placeholder="e.g. flagship, sport, travel"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={runQuery} disabled={loading}>
          {loading ? 'Running...' : 'Run Query'}
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      {result && (
        <>
          <div className="result-count">
            Found <strong>{result.data.length}</strong> product(s)
          </div>

          {result.data.length > 0 ? (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Attributes (JSONB)</th>
                    <th>Tags (Array)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.data.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td><span className="category-badge">{p.category}</span></td>
                      <td>{formatPrice(p.price)}</td>
                      <td>
                        <pre className="json-cell">{JSON.stringify(p.attributes, null, 2)}</pre>
                      </td>
                      <td>
                        <div className="tags-list">
                          {p.tags.map((t) => (
                            <span key={t} className="tag-badge">{t}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-result">No products match the selected filters.</div>
          )}

          <SqlPanel sql={result.sql} />

          <ExplanationBox
            feature="JSONB + Array + GIN Index"
            explanation={result.explanation}
            bullets={[
              'JSONB lưu trữ dữ liệu bán cấu trúc, mỗi sản phẩm có thể có attributes khác nhau',
              'Toán tử ->> truy xuất giá trị JSONB theo key như một TEXT',
              'Array TEXT[] lưu tags, dùng @> ARRAY[...] để kiểm tra phần tử',
              'GIN index trên cột JSONB và Array giúp tìm kiếm O(log n) thay vì O(n)',
              'Không cần thêm cột riêng cho từng thuộc tính — flexible schema trong RDBMS',
            ]}
          />
        </>
      )}
    </div>
  );
}
