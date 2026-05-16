interface ExplanationBoxProps {
  feature: string;
  explanation: string;
  bullets?: string[];
}

export default function ExplanationBox({ feature, explanation, bullets }: ExplanationBoxProps) {
  return (
    <div className="explanation-box">
      <div className="explanation-header">
        <span className="explanation-icon">ℹ</span>
        <span className="explanation-feature">PostgreSQL Feature: {feature}</span>
      </div>
      <p className="explanation-text">{explanation}</p>
      {bullets && bullets.length > 0 && (
        <ul className="explanation-bullets">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
