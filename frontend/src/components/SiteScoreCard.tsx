import type { CSSProperties } from "react";

interface SiteScoreCardProps {
  score: number;
}

const cardStyle: CSSProperties = {
  border: "1px solid #E5E7EB",
  borderRadius: 12,
  padding: 16,
  backgroundColor: "#FFFFFF"
};

const scoreStyle: CSSProperties = {
  fontSize: 32,
  fontWeight: 700
};

const labelStyle: CSSProperties = {
  color: "#6B7280",
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.04em"
};

export const SiteScoreCard = ({ score }: SiteScoreCardProps) => {
  return (
    <div style={cardStyle}>
      <div style={labelStyle}>Site score</div>
      <div style={scoreStyle}>{score}</div>
    </div>
  );
};
