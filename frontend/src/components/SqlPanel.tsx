import { useState } from 'react';

interface SqlPanelProps {
  sql: string;
}

export default function SqlPanel({ sql }: SqlPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sql).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="sql-panel">
      <div className="sql-panel-header">
        <span className="sql-panel-title">SQL Query</span>
        <button className="btn-copy" onClick={handleCopy}>
          {copied ? '✓ Copied' : 'Copy SQL'}
        </button>
      </div>
      <pre className="sql-code">{sql}</pre>
    </div>
  );
}
