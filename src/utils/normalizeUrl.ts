export const normalizeUrl = (url: string): string => {
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();
  return lower.endsWith("/") ? lower.slice(0, -1) : lower;
};
