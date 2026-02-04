import type { CSSProperties } from "react";

interface CategoryScoreGridProps {
  scores: Record<string, number>;
}

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 12,
  marginTop: 16
};

const tileStyle: CSSProperties = {
  border: "1px solid #E5E7EB",
  borderRadius: 12,
  padding: 12,
  backgroundColor: "#FFFFFF"
};

const labelStyle: CSSProperties = {
  color: "#6B7280",
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.04em"
};

const scoreStyle: CSSProperties = {
  fontSize: 20,
  fontWeight: 600
};

export const CategoryScoreGrid = ({ scores }: CategoryScoreGridProps) => {
  return (
    <div style={gridStyle}>
      {Object.entries(scores).map(([category, score]) => (
        <div key={category} style={tileStyle}>
          <div style={labelStyle}>{category}</div>
          <div style={scoreStyle}>{score}</div>
        </div>
      ))}
    </div>
  );
};
